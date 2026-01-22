import express from 'express'
import cors from 'cors'
import compression from 'compression';
import multer from 'multer';
import { env, loadEnvFile } from 'node:process'

loadEnvFile();
const app = express()

app.set('query parser', 'simple')
app.use(express.json())
app.use(compression())
app.use(express.static('../public'));
app.use(cors({
	origin: '*',
	credentials: false,
}))


import SwaggerUI from 'swagger-ui-express'
import swaggerDocument from './config/swagger_output.json' with { type: 'json' };
app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

import authRoutes from "./routes/auth.routes.js"
app.use("/auth", authRoutes)

import usersRoutes from "./routes/users.routes.js"
app.use("/users", usersRoutes)

import { responseWithStatus } from './utils/RESPONSES.js';
app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		return responseWithStatus(res, 0, 415, err.message)
	} else if (err) {
		return responseWithStatus(res, 0, 400, err.message, { "error_details": "Form field does not satisfy requirement. Please enter the correct field name for uploading the file." })
	}
	next(err);
});

app.use((req, res) => {
	res.status(404).json({
		status: 404,
		message: 'Page not found. Use the default root endpoint for a guide on available APIs.',
	});
});

// ------------------------------------------------------------------------
// App Initialization
app.listen(env.APP_PORT, () => {
	console.log(`${env.APP_NAME} listening on port ${env.APP_PORT}`)
})
