// import swaggerJSDoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const options = {
// 	definition: {
// 		openapi: "3.0.0",
// 		info: {
// 			title: "Campaigns In Node + PostgreSQL API",
// 			version: "1.0.0",
// 			description: "Campaigns System API Documentation",
// 		},
// 		// components: {
// 		// 	securitySchemes: {
// 		// 		BearerAuth: {
// 		// 			type: "http",
// 		// 			scheme: "bearer",
// 		// 			bearerFormat: "JWT",
// 		// 		},
// 		// 	},
// 		// },
// 		security: [
// 			{
// 				BearerAuth: [],
// 			},
// 		],
// 	},

// 	// IMPORTANT — scan ALL js files
// 	apis: ["../routes/*", "../server.js"],
// };

// export const swaggerSpec = swaggerJSDoc(options);

// module.exports = (app, port) => {
// 	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 	console.log(`Swagger Docs running at http://localhost:${port}/api-docs`);
// };

import swaggerAutogen from 'swagger-autogen';
import {env, loadEnvFile} from "process";
loadEnvFile();

const outputFile = './swagger_output.json';
const endpointsFiles = ["../server.js"]; // Point to your main application file or specific route files

	// host: `localhost:${env.PORT || 3000}`,
const doc = {
	openapi: "3.1.0",
	info: {
		version: '1.0.1',
		title: 'Kilomilano Makeup - API Documentation',
		description: 'Documentation for the available API endpoints',
	},
	host: env.BASE_URL,
	schemes: ['http'],
	consumes: ['application/json'], 
	produces: ['application/json'], 
	components: {
		securitySchemes: {
			bearerAuth: {
				type: "http",
				scheme: "bearer",
				bearerFormat: "JWT"
			}
		},
		schemas: {
			registerSchema: {
				data: {
					$name: 'John Doe',
					$email: 'example@example.com',
					$password: 'secret_password',
					$confirmed_password: 'secret_password'
				}
			},
			loginSchema: {
				data: {
					$email: 'example@example.com',
					$password: 'secret_password',
				}
			},
        }
	},
	security: [{
		bearerAuth: []
	}],
	tags: [
		{
			name: 'Authentication',
			description: 'User authentication and authorization endpoints'
		},
		{
			name: 'Users',
			description: 'User related endpoints'
		},
	]
};

const options = {
	openapi: '3.1.0',
	autoHeaders: true,
	autoQuery: true,
	autoBody: true
};

// swaggerAutogen({ openapi: '3.1.0' })(outputFile, endpointsFiles, doc, options);
swaggerAutogen(options)(outputFile, endpointsFiles, doc);