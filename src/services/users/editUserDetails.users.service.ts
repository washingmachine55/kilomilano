import pool from '#/config/db';
import { GET_ALL_USER_DETAILS_BY_ID } from '#/providers/commonQueries.providers.js';
import { RecordCheck } from '#/providers/recordChecks.providers.js';
import { BadRequestError, NotFoundError, trialCapture } from '#/utils/errors.js';
import { nameSplitter } from '#/utils/nameSplitter.js';
import saveNewUserPasswordToDB from '../auth/saveNewPassword.auth.service.js';

export const editUserDetails = async (fieldsToUpdate, verifiedUserId) => {
	// const conn = await pool.connect();

	if (fieldsToUpdate.hasOwnProperty('email')) {
		// const [data, error] = await trialCapture(
		// 	new RecordCheck("email", "tbl_users", fieldsToUpdate.email).getResult()
		// )
		const data =
			await pool.query(
				`
				SELECT CASE WHEN EXISTS (
					SELECT
					FROM tbl_users u
					WHERE email = $1
				) THEN true ELSE false END AS ExistsCheck;`,
				[fieldsToUpdate.email]
			).catch((error)=>{
				throw new Error('Something went wrong while trying to check if email exists', { cause: error });
			})
		if (data.rows[0].existscheck === false) {
			const emailUpdate =
				await pool.query(
					`UPDATE tbl_users SET email = $1, updated_at = NOW(), updated_by = $2 WHERE id = $2 RETURNING id, email, phone_no, access_type, created_at, updated_at`,
					[fieldsToUpdate.email, verifiedUserId]
				).catch((Error)=>{
					throw new NotFoundError('Unable to find user in database', Error);
				})
		} else {
			const result = await pool.query(
				`
				SELECT CASE WHEN EXISTS (
					SELECT
					FROM tbl_users u
					WHERE email = $1 AND id != $2
				) THEN true ELSE false END AS ExistsCheck;`,
				[fieldsToUpdate.email, verifiedUserId]
			);
			if (result.rows[0].existscheck === true) {
				throw new BadRequestError('That email is already taken!');
			}
		}
	}

	if (fieldsToUpdate.hasOwnProperty('name')) {
		const nameArr = await nameSplitter(fieldsToUpdate.name);
		const userDetailsToSave = [nameArr[0], nameArr[1], verifiedUserId];
		const nameCheck =
			await pool.query(
				`
			SELECT CASE WHEN EXISTS (SELECT  
			FROM tbl_users u
			JOIN tbl_users_details ud ON u.id = ud.users_id
			WHERE users_id = $3 AND first_name = $1 AND last_name = $2) THEN true ELSE false END AS ExistsCheck;
			`,
				[nameArr[0], nameArr[1], verifiedUserId]
			).catch((Error)=>{
				throw new Error('Error checking name from database', { cause: Error });
			})
		if (nameCheck.rows[0].existscheck === false) {
				await pool.query(
					`UPDATE tbl_users_details SET first_name = $1, last_name = $2, updated_at = NOW(), updated_by = $3 WHERE users_id = $3 RETURNING users_id, first_name, last_name, created_at, updated_at`,
					userDetailsToSave
				).catch((Error)=>{
					throw new Error('Unable to save name changes in database', { cause: Error });
				})
		}
	}

	if (fieldsToUpdate.hasOwnProperty('password')) {
		const [resultPass, errorPass] = await trialCapture(
			await saveNewUserPasswordToDB(null, fieldsToUpdate.password, verifiedUserId)
		);
		if (errorPass) {
			throw new Error("Error updating user's password to database", { cause: errorPass });
		}
	}

	if (fieldsToUpdate.hasOwnProperty('email') && fieldsToUpdate.hasOwnProperty('password')) {
		const [emailPass, errorEmailPass] = await trialCapture(
			await saveNewUserPasswordToDB(fieldsToUpdate.email, fieldsToUpdate.password)
		);
		if (errorEmailPass) {
			throw new Error("Error updating user's password to database", { cause: errorEmailPass });
		}
	}

	const result = await pool.query(GET_ALL_USER_DETAILS_BY_ID, [verifiedUserId]);

	// conn.release();
	return result.rows[0];
};
