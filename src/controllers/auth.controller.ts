import {
	getUserId as getUserIdAndAllDetails,
	isCredentialsMatching,
} from '../services/auth/authenticateUser.auth.service';
import { checkExistingEmail_v2 } from '../services/auth/checkExistingEmail.auth.service';
import registerUserToDatabase from '../services/auth/registerUser.auth.service';
import { responseWithStatus } from '../utils/responses';
import { createForgotPasswordEmail } from '../services/auth/createForgotPasswordEmail.auth.service';
import { verifyOTPFromDB } from '../services/auth/verifyOTP.auth.service';
import saveNewUserPasswordToDB from '../services/auth/saveNewPassword.auth.service';
import { signJwtAsync, verifyJwtAsync } from '../utils/jwtUtils';
import { attempt, BadRequestError, ForbiddenError, trialCapture, UnauthorizedError } from '../utils/errors';
import type { NextFunction, Request, Response } from 'express';
import {
	ACCESS_TOKEN_SECRET_KEY,
	ACCESS_TOKEN_EXPIRATION_TIME,
	REFRESH_TOKEN_SECRET_KEY,
	REFRESH_TOKEN_EXPIRATION_TIME,
	TEMPORARY_TOKEN_SECRET_KEY,
	TEMPORARY_TOKEN_EXPIRATION_TIME,
} from '../config/env-config';

export const registerUser = attempt(async (req: Request, res: Response, next?: NextFunction) => {
	const request: string[] = Object.values(req.body.data);
	const userName: string = request[0]!;
	const userEmail: string = request[1]!;
	const userPassword: string = request[2]!;

	// --------------------------------------------------------------------------- //
	// Check if email exists in database already
	// --------------------------------------------------------------------------- //
	console.log('before response');
	console.log(await checkExistingEmail_v2(userEmail));

	const existingEmailCheck = await checkExistingEmail_v2(userEmail);
	console.log('after response');
	if (existingEmailCheck === true) {
		throw new ForbiddenError(
			'Cant register user as user email already exists. Please sign in instead',
			'unable to wables'
		);
	} else {
		// --------------------------------------------------------------------------- //
		// Save User details to Database if all checks are cleared
		// --------------------------------------------------------------------------- //
		const entryArray: string[] = [userName, userEmail, userPassword];
		const userRegistrationResult = await registerUserToDatabase(entryArray);
		const accessToken = await signJwtAsync({ id: userRegistrationResult.id }, ACCESS_TOKEN_SECRET_KEY, {
			expiresIn: `${Number(ACCESS_TOKEN_EXPIRATION_TIME)}MINS`,
		});
		const refreshToken = await signJwtAsync({ id: userRegistrationResult.id }, REFRESH_TOKEN_SECRET_KEY, {
			expiresIn: `${Number(REFRESH_TOKEN_EXPIRATION_TIME)}MINS`,
		});

		return responseWithStatus(res, 1, 201, 'Sign Up successful!', {
			user_details: userRegistrationResult,
			access_token: accessToken,
			refresh_token: refreshToken,
		});
	}
});

export const loginUser = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	const userEmail = req.body.data.email;
	const userPassword = req.body.data.password;
	// --------------------------------------------------------------------------- //
	// Check if email doesn't exist in database already
	// --------------------------------------------------------------------------- //
	const existingEmailCheck = await checkExistingEmail_v2(userEmail);
	if (existingEmailCheck === true) {
		// --------------------------------------------------------------------------- //
		// Email and Password Combination Check
		// --------------------------------------------------------------------------- //
		const credentialMatchingResult = await isCredentialsMatching(userEmail, userPassword);
		if (credentialMatchingResult == true) {
			const userDetails = await getUserIdAndAllDetails(userEmail, userPassword);
			const accessToken = await signJwtAsync({ id: userDetails.id }, ACCESS_TOKEN_SECRET_KEY, {
				expiresIn: `${Number(ACCESS_TOKEN_EXPIRATION_TIME)}MINS`,
			});
			const refreshToken = await signJwtAsync({ id: userDetails.id }, REFRESH_TOKEN_SECRET_KEY, {
				expiresIn: `${Number(REFRESH_TOKEN_EXPIRATION_TIME)}MINS`,
			});

			await responseWithStatus(res, 1, 200, 'Sign in successful!', {
				user_details: userDetails,
				access_token: accessToken,
				refresh_token: refreshToken,
			});
		} else {
			throw new UnauthorizedError("Credentials Don't match. Please try again.");
		}
	} else {
		throw new UnauthorizedError("Email doesn't exist. Please sign up instead.");
	}
});

interface Veri {
	id: string;
}

export const verifyUserToken = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	if (!req.header('Authorization')) {
		responseWithStatus(res, 0, 401, 'Unauthorized. Access Denied. Please login.');
	} else {
		const token: string = req.header('Authorization')!.split(' ')[1] || '';
		try {
			const verified: Promise<Veri> = (verifyJwtAsync(token, ACCESS_TOKEN_SECRET_KEY).catch((err)=>{
				throw new UnauthorizedError('Unable to verify JWT. Please login or register.', {cause: err});
			}));
			responseWithStatus(res, 1, 200, 'Token Verified Successfully', { user_id: `${(await verified).id}` });
		} catch (err) {
			responseWithStatus(res, 0, 401, 'Invalid Token. Please login.', { error_info: `${err}` });
		}
	}
});

export const refreshToken = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	if (req.header('Authorization')) {
		const oldRefreshToken: string = req.header('Authorization')!.split(' ')[1] || '';
		const token = verifyJwtAsync(oldRefreshToken, REFRESH_TOKEN_SECRET_KEY).catch(()=> {
			responseWithStatus(res, 0, 401, 'Unauthorized. Invalid refresh token.');
		});
			const accessToken = await signJwtAsync(
				{
					id: token.id,
				},
				ACCESS_TOKEN_SECRET_KEY,
				{
					expiresIn: `${Number(ACCESS_TOKEN_EXPIRATION_TIME)}MINS`,
				}
			);
			const refreshToken = await signJwtAsync(
				{
					id: token.id,
				},
				REFRESH_TOKEN_SECRET_KEY,
				{
					expiresIn: `${Number(REFRESH_TOKEN_EXPIRATION_TIME)}MINS`,
				}
			);
			responseWithStatus(res, 1, 201, 'Tokens refreshed successfully', {
				access_token: accessToken,
				refresh_token: refreshToken,
			});
	} else {
		responseWithStatus(res, 0, 401, 'Unauthorized. Invalid token.');
	}
});

export const forgotPassword = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	const userEmail = Object.values(req.body.data).toString();

	const existingEmailCheck = await checkExistingEmail_v2(userEmail);
	if (existingEmailCheck === false) {
		throw new UnauthorizedError("Email doesn't exist. Please sign up instead.");
	} else {
		await createForgotPasswordEmail(userEmail);
		responseWithStatus(
			res,
			1,
			200,
			'An OTP has been shared to your email address. Please use that to reset your password in the next screen.'
		);
	}
});

export const verifyOTP = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	const userEmail: string = req.body.data.email;
	const userOTP: number = Number(req.body.data.otp);

	const result = await verifyOTPFromDB(userEmail, userOTP);
	try {
		if (result === true) {
			const [tempToken, err] = await trialCapture(
				signJwtAsync({ id: userEmail }, TEMPORARY_TOKEN_SECRET_KEY, {
					expiresIn: `${Number(TEMPORARY_TOKEN_EXPIRATION_TIME)}MINS`,
				})
			);
			if (err) {
				responseWithStatus(res, 1, 500, 'Error occurred in creating a temporary token', err);
			} else {
				responseWithStatus(res, 1, 200, 'OTP has been verified!', {
					temporary_token: tempToken,
					expires_in: '10 Minutes',
				});
			}
		} else {
			responseWithStatus(res, 1, 401, 'Invalid OTP or email does not exist');
		}
	} catch (error) {
		console.log(error);
	}
});

export const resetPassword = attempt(async (req: Request, res: Response, _next: NextFunction) => {
	if (!req.header('Authorization')) {
		responseWithStatus(res, 0, 401, 'Unauthorized. Access Denied. Please request another OTP.');
	} else {
		const token: string = req.header('Authorization')!.split(' ')[1] || '';
		const userEmail = req.body.data.email;
		const userPassword = req.body.data.password;

		const tempTokenResult = verifyJwtAsync(token, TEMPORARY_TOKEN_SECRET_KEY);
		if (tempTokenResult.id !== userEmail) {
			throw new BadRequestError('Nice try lol');
		}
		const userRegistrationResult: Veri = await saveNewUserPasswordToDB(userEmail, userPassword)
			.catch((err)=> {
			throw new BadRequestError('Request failed, Email must be faulty', {cause: err});
		});

		const accessToken = await signJwtAsync({ id: userRegistrationResult.id }, ACCESS_TOKEN_SECRET_KEY, {
			expiresIn: `${Number(ACCESS_TOKEN_EXPIRATION_TIME)}MINS`,
		});
		const refreshToken = await signJwtAsync({ id: userRegistrationResult.id }, REFRESH_TOKEN_SECRET_KEY, {
			expiresIn: `${Number(REFRESH_TOKEN_EXPIRATION_TIME)}MINS`,
		});
		responseWithStatus(res, 1, 201, 'Password Reset successful!', {
			user_details: userRegistrationResult,
			access_token: accessToken,
			refresh_token: refreshToken,
		});
	}
});