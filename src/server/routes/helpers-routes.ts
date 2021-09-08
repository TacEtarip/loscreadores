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

    router.get('/getUnidadesDeMedida', controladores.getUnidadesDeMedida);

    router.get('/getColores', controladores.getColores);

    router.get('/getProveedores', controladores.getProveedores);

    router.get('/getMarcas', controladores.getMarcas)

    router.get('/getColor/:codColor', controladores.getColor);

    router.post('/insertarColor', controladores.insertarColor);

    router.post('/modificarColor', controladores.modificarColor);

    //* Trabajo

    router.post('/insertarTrabajo', controladores.insertarTrabajo);

    //* Ubicacion

    router.get('/getDepartamentos', controladores.getDepartamentos);

    router.post('/getProvincias', controladores.getProvincias);

    router.post('/getDistritos', controladores.getDistritos);

    router.post('/agregarMarca', controladores.agregarMarca);

    return { router, ruta };
};