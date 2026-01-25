import pool from '../../config/db.js';

export async function getAllUsersDetails() {
	const conn = await pool.connect();

	try {
		const result = await conn.query(
			'SELECT u.id, u.email, u.access_type, u.created_at, ud.first_name, ud.last_name, ud.profile_pic_url from tbl_users u JOIN tbl_users_details ud ON ud.users_id = u.id;'
		);

		return result.rows;
	} catch (err) {
		console.error('Error creating record:', err);
	} finally {
		conn.release();
	}
}
