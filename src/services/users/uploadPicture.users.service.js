import pool from "../../config/db.js";

export async function uploadUserProfilePictureToDB(userId,file) {
	
	const fileToUpload = file
	console.log(fileToUpload)

	const conn = await pool.connect();

	try {

		const result = await conn.query("UPDATE tbl_users_details SET profile_pic_url = $1 WHERE users_id = $2 RETURNING profile_pic_url", [fileToUpload.path, userId])

		// const result = await conn.query("SELECT u.id, u.email, u.access_type, u.created_at, ud.first_name, ud.last_name, ud.profile_pic_url from tbl_users u JOIN tbl_users_details ud ON ud.users_id = u.id;");

		return result.rows[0]

	} catch (err) {
		console.error("Error creating record:", err)
	} finally {
		conn.release()
	}
}