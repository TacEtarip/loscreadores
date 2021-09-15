import http from 'http';
import { AddressInfo } from 'net';
import throng from 'throng';
import config from './config/config';
import { app } from './server/server';
import { ConeccionSQL } from './server/lib/connect-to-sql';
import sql from 'mssql';
import { Configuracion } from './server/lib/interfaces';

let configENV: Configuracion;

switch (process.env.NODE_ENV) {
  case 'development':
      configENV = config.development;
      break;
  case 'production':
      configENV = config.production;
      break;
  default:
    configENV = config.development;
    break;
}

const WORKERS = (process.env.WEB_CONCURRENCY || 1) as number;

const configuracionSQL = 
  new ConeccionSQL(configENV.servidorSQL, configENV.usuarioSQL, 
    configENV.passwordSQL, configENV.baseDeDatosSQL).getConfig;

const start = async (id: number) => {
  try {
    configENV.log().info(`Id Worker ${id}`);
    const pool = await sql.connect(configuracionSQL);
    const expressAPP = app(configENV, pool);
    expressAPP.set('PORT', configENV.PORT || 0);
    const server = http.createServer(expressAPP);
    server.listen(expressAPP.get('PORT'));
    server.on('listening', () => {
      configENV.log().info('http://localhost:' + (server.address() as AddressInfo).port);
    });
    server.on('close', () => {
      pool.close();
    })
    return server;
  } catch (error) {
    configENV.log().error(error)
    return null;
  }
};

throng({ worker: start, count: WORKERS });

export const sumaTest = (nOne: number, nTwo: number): number => {
  return nOne + nTwo;
};