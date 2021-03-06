import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Response, Request, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rutasHelpers } from './routes/helpers-routes';
import { rutasLogin } from './routes/login-routes';
import { rutasMateriales } from './routes/materiales-routes';
import { Configuracion } from './lib/interfaces';
import sql from 'mssql';
import jwt from 'jsonwebtoken';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from '../documentation/swaggerDocument.json';


export const app = (configENV: Configuracion, pool: sql.ConnectionPool): 
express.Express => {

  const app = express();
  app.use(helmet());
  app.use(compression())
  app.use(cookieParser());

  app.use(cors());

  app.use(morgan(':method :url'));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers && req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'JWT') {
        const auth = req.headers.authorization;
        // * JWT #token #codUsuario #username #tipo
        jwt.verify(auth.split(' ')[1], configENV.jwtKey, 
        {audience: `${auth.split(' ')[2]} ${auth.split(' ')[3]} ${auth.split(' ')[4]}`}, (err, decode) => {
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

  const routesHelper = rutasHelpers(configENV, pool);
  const routesLogin = rutasLogin(configENV, pool);
  const routesMateriales = rutasMateriales(configENV, pool);

  app.use(routesHelper.ruta, routesHelper.router);
  app.use(routesLogin.ruta, routesLogin.router);
  app.use(routesMateriales.ruta, routesMateriales.router);

  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  return app;
}




