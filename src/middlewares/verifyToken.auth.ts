// import jwt from 'jsonwebtoken';
import { env, loadEnvFile } from 'node:process';
import { responseWithStatus } from '#/utils/responses.js';
import { verifyJwtAsync } from '#/utils/jwtUtils.js';
import { RecordCheck } from '#/providers/recordChecks.providers.js';
import { NotFoundError } from '#/utils/errors.js';
loadEnvFile();

const verifyToken = async (req, res, next) => {
	const verifyTokenFunc = async (req, res, next) => {
		if (!req.header('Authorization')) {
			return responseWithStatus(res, 0, 401, 'Unauthorized. Access Denied. Please login.');
		} else {
			const token = req.header('Authorization').split(' ')[1];
			try {
				const verified = await verifyJwtAsync(token, env.ACCESS_TOKEN_SECRET_KEY);
				const checkIfUserExists = new RecordCheck('id','tbl_users',verified.id)
				if (!await checkIfUserExists.getResult()) {
					throw new NotFoundError("User not found");
				}
				req.user = verified;
				next();
			} catch (err) {
				next(err);
			}
		}
	};

	switch (req.path) {
		case '/auth/register':
			next();
			break;
		case '/auth/login':
			next();
			break;
		case '/auth/forgot-password':
			next();
			break;
		case '/auth/verify-otp':
			next();
			break;
		case '/auth/refresh': // Bypassing this as it requires usage of Refresh token instead of access token
			next();
			break;
		case '/auth/reset-password': // Bypassing this as it requires usage of Temporary token instead of access token
			next();
			break;
		default:
			await verifyTokenFunc(req, res, next);
			break;
	}
};

export default verifyToken;
