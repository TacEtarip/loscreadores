// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

import * as express from 'express';
import { Request, Response } from 'express';
const app = express();
const {
  PORT,
  NODE_ENV,
} = process.env;
app.get('/', (req: Request, res: Response) => {
  res.send({
    testMensaje: 'hola mundo',
  });
});
app.listen(PORT, () => {
  console.log(NODE_ENV);
  console.log('Aqui http://localhost:'+PORT);
});

export const sumaTest = (nOne: number, nTwo: number): number => {
  return nOne + nTwo;
};