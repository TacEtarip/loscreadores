import * as http from 'http';
import { AddressInfo } from 'net';
import * as throng from 'throng';
import config from './config/config';
import { app } from './server/server';

const configENV = process.env.NODE_ENV === 'development' ? config.development : config.production;

const WORKERS = (process.env.WEB_CONCURRENCY || 1) as number;

const start = async (id: number) => {
  try {
    configENV.log().info(`Id Worker ${id}`);
    const expressAPP = await app(configENV);
    expressAPP.set('PORT', configENV.PORT || 0);
    const server = http.createServer(expressAPP);
    server.listen(expressAPP.get('PORT'));
    server.on('listening', () => {
      configENV.log().info('http://localhost:' + (server.address() as AddressInfo).port);
    })
  } catch (error) {
    configENV.log().error(error)
  }
};

throng({ worker: start, count: WORKERS });



export const sumaTest = (nOne: number, nTwo: number): number => {
  return nOne + nTwo;
};