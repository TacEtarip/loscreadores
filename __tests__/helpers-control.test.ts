import { app } from '../src/server/server';
import request from 'supertest';
import sql from 'mssql';
import config from '../src/config/config'
import { ConeccionSQL } from '../src/server/lib/connect-to-sql';
import { Express } from 'express';
import http from 'http';

let pool: sql.ConnectionPool = null;
const configENV = config.development;
const configuracionSQL = 
    new ConeccionSQL(configENV.servidorSQL, configENV.usuarioSQL, 
configENV.passwordSQL, configENV.baseDeDatosSQL).getConfig;
let api: Express;
let server: http.Server;

describe('Utilidades Tests', () => {
    it('deberia retornar 200', async () => {
        const respuestaEjemplo = {mensaje: "Rutas de helpers"}
        const response = await request(api).get('/helper');
        expect(response.body).toStrictEqual(respuestaEjemplo);
        expect(response.statusCode).toBe(200);
    });

    it('Colores deberian retonar lista 200', async () => {
        const response = await request(api).get('/helper/getColores');
        console.log(response);
        expect(response.statusCode).toBe(200);
        expect(response.headers['content-type']).toBe("application/json; charset=utf-8");
    });

    beforeAll(async () => {
        pool = await sql.connect(configuracionSQL);
        api = app(configENV, pool);
        server = api.listen(400);
        server.on('close', () => {
            pool.close();
        })
    });

    afterAll(() => {
        server.close();
    });
})







