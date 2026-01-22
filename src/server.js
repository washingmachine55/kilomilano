import express from 'express'
import cors from 'cors'
import compression from 'compression';
import { env, loadEnvFile } from 'node:process'

import SwaggerUI from 'swagger-ui-express'
// import { swaggerSpec } from './config/swagger.js';
import swaggerDocument from './config/swagger_output.json' with { type: 'json' }; 

loadEnvFile();
const app = express()
const port = 3333

app.use(express.json())
app.use(compression())
app.use(express.static('../public'));

app.use(cors({
	origin: '*',
	credentials: false,
}))

app.set('query parser', 'simple')

app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerDocument));

import authRoutes from "./routes/auth.routes.js"
app.use("/auth", authRoutes)

import usersRoutes from "./routes/users.routes.js"
app.use("/users", usersRoutes)

app.use((req, res) => {
	res.status(404).json({
		status: 404,
		message: 'Page not found. Use the default root endpoint for a guide on available APIs.',
	});
});

// ------------------------------------------------------------------------
// App Initialization
app.listen(port, () => {
	console.log(`${env.APP_NAME} listening on port ${port}`)
})
