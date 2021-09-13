// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import bunyan from 'bunyan';

import pjs from '../../package.json';

const { version } = pjs;

const getLogger = (serviceName: string, serviceVersion: string) => 
bunyan.createLogger({ name: `${serviceName}:${serviceVersion}` });

const config = {
	development: {
		PORT: process.env.PORT,
		link: 'http://localhost:5000/',
        servidorSQL: process.env.SERVIDOR_SQL,
        usuarioSQL: process.env.USUARIO_SQL,
        passwordSQL: process.env.PASSWORD_SQL,
        baseDeDatosSQL: process.env.BASE_DE_DATOS_NAME,
        jwtKey: process.env.JWT_TOKEN_KEY,
        tokenSUNAT: process.env.SUNAT_TOKEN,
		log: (): bunyan => getLogger('DESARROLLO', version),
	},

	production: {
		PORT: process.env.PORT,
		link: 'http://localhost:5000/',
        servidorSQL: process.env.SERVIDOR_SQL,
        usuarioSQL: process.env.USUARIO_SQL,
        passwordSQL: process.env.PASSWORD_SQL,
        baseDeDatosSQL: process.env.BASE_DE_DATOS_NAME,
        jwtKey: process.env.JWT_TOKEN_KEY,
        tokenSUNAT: process.env.SUNAT_TOKEN,
        log: (): bunyan => getLogger('PRODUCCION', version),
	},
};

export default config;



