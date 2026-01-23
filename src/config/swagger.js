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
		title: `${env.APP_NAME} - API Documentation`,
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

swaggerAutogen(options)(outputFile, endpointsFiles, doc);