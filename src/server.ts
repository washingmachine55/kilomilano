import app from './app.js';
import pool from './config/db';
import { APP_HEADERS_TIMEOUT, APP_KEEP_ALIVE_TIMEOUT, APP_NAME, APP_PORT, NODE_ENV } from './config/env-config';
import transporter from './config/mailTransporter';

// ======================================================================
// ======================  App Initialization  ==========================
// ======================================================================
export const server = app.listen(APP_PORT, () => {
	if (NODE_ENV === 'dev') {
		console.log(`${APP_NAME} listening on port ${APP_PORT}`);
	}
});

if (NODE_ENV === 'dev') {
	try {
		async () => {
			await transporter.verify();
		}
		console.log('Mailpit Server is ready to take our mail messages');
	} catch (err) {
		console.error('Mailpit Verification failed', err);
	}
}

(async (): Promise<void> => {
	const dbConectionStatus = await pool.query('SELECT NOW()');
	console.log(dbConectionStatus.rows[0]);
})();

process.on('SIGTERM', () => {
	console.debug('SIGTERM signal received: closing HTTP server');
	server.close(() => {
		console.debug('HTTP server closed');
	});
});

server.keepAliveTimeout = Number(APP_KEEP_ALIVE_TIMEOUT);
server.headersTimeout = Number(APP_HEADERS_TIMEOUT);