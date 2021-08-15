import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as helmet from 'helmet';
import { rutasHelpers } from './routes/helpers-routes';
import { rutasLogin } from './routes/login-routes';
import { Configuracion } from './lib/interfaces';
import { ConeccionSQL } from './lib/connect-to-sql';
import * as sql from 'mssql';


export const app = async (configENV: Configuracion): Promise<express.Express> => {


  const configuracionSQL = 
  new ConeccionSQL(configENV.servidorSQL, configENV.usuarioSQL, configENV.passwordSQL, configENV.baseDeDatosSQL).getConfig;

  const app = express();
  app.use(helmet());
  app.use(compression())
  app.use(cookieParser());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const pool = await sql.connect(configuracionSQL);

  const routesHelper = rutasHelpers(configENV, pool);
  const routesLogin = rutasLogin(configENV, pool);

  app.use(routesHelper.ruta, routesHelper.router);
  app.use(routesLogin.ruta, routesLogin.router);

  return app;
}




