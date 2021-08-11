// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import * as bunyan from 'bunyan';

const version = '0.0.1';

const getLogger = (serviceName: string, serviceVersion: string) => 
bunyan.createLogger({ name: `${serviceName}:${serviceVersion}` });

const config = {
	development: {
		PORT: process.env.PORT,
		link: 'http://localhost:5000/',
		log: (): bunyan => getLogger('DESARROLLO', version),
	},

	production: {
		PORT: process.env.PORT,
		link: 'http://localhost:5000/',
        log: (): bunyan => getLogger('PRODUCCION', version),
	},
};

export default config;


