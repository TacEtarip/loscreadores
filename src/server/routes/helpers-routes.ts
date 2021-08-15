import { Router } from 'express';
import { Configuracion } from '../lib/interfaces';
import { ConnectionPool } from 'mssql';
import { helpersControladores } from '../controllers/helpers-control';

export const rutasHelpers = (configENV: Configuracion, pool: ConnectionPool): {router:Router, ruta: string} => {
    const router = Router();
    const ruta = '/helper';

    const controladores = helpersControladores(configENV, pool);

    router.get('/', (req, res) => {
        configENV.log().info('Here');
        res.send({mensaje: 'Rutas de helpers'});
    });

    router.get('/getColores', controladores.getColores);

    router.get('/getColor/:codColor', controladores.getColor);

    router.post('/insertarColor', controladores.insertarColor);

    router.post('/modificarColor', controladores.modificarColor);

    //* Trabajo

    router.post('/insertarTrabajo', controladores.insertarTrabajo);

    return { router, ruta };
};