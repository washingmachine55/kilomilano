import pool from "../../config/db.js";

export async function uploadUserProfilePictureToDB(userId, file) {
	const fileToUpload = file.path
	const conn = await pool.connect();
	try {
		const result = await conn.query("UPDATE tbl_users_details SET profile_pic_url = $1 WHERE users_id = $2 RETURNING profile_pic_url", [fileToUpload, userId])

		return result.rows[0]
	} catch (err) {
		console.error("Error creating record:", err)
	} finally {
		conn.release()
	}
}