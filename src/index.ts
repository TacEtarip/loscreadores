import app from './server/server';
import * as http from 'http';
import config from './config/config';
import { AddressInfo } from 'net';

const configENV = process.env.NODE_ENV === 'development' ? config.development : config.production;

app.set('PORT', configENV.PORT);

const server = http.createServer(app);

server.listen(app.get('PORT'))

server.on('listening', () => {
  configENV.log().info('http://localhost:' + (server.address() as AddressInfo).port);
})

export const sumaTest = (nOne: number, nTwo: number): number => {
  return nOne + nTwo;
};