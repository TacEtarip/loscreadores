import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import { Response, Request, NextFunction } from 'express';
import { rutasHelpers } from './routes/helpers-routes';
import { rutasLogin } from './routes/login-routes';
import { rutasMateriales } from './routes/materiales-routes';
import { Configuracion } from './lib/interfaces';
import { ConeccionSQL } from './lib/connect-to-sql';
import * as sql from 'mssql';
import * as jwt from 'jsonwebtoken';


export const app = async (configENV: Configuracion): Promise<express.Express> => {


  const configuracionSQL = 
  new ConeccionSQL(configENV.servidorSQL, configENV.usuarioSQL, configENV.passwordSQL, configENV.baseDeDatosSQL).getConfig;

  const app = express();
  app.use(helmet());
  app.use(compression())
  app.use(cookieParser());

  app.use(cors())

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers && req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT') {
        const auth = req.headers.authorization;
        jwt.verify(auth.split(' ')[1], configENV.jwtKey, 
        {audience: `${auth.split(' ')[2]} ${auth.split(' ')[3]} ${auth.split(' ')[4]}`}, (err, decode) => {
          console.log('qweqew');
          if (err) {
            res.locals.usuario = undefined;
            return res.status(401).json({ message: 'BAD USER' });
          }
          else {
            res.locals.usuario = decode;
          }
          next();  
        });  
      }	
      else {
        res.locals.usuario = undefined;
        next();
      }
  })

  const pool = await sql.connect(configuracionSQL);

  const routesHelper = rutasHelpers(configENV, pool);
  const routesLogin = rutasLogin(configENV, pool);
  const routesMateriales = rutasMateriales(configENV, pool);

  app.use(routesHelper.ruta, routesHelper.router);
  app.use(routesLogin.ruta, routesLogin.router);
  app.use(routesMateriales.ruta, routesMateriales.router);

  return app;
}




