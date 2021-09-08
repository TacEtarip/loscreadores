import { Router } from 'express';
import { Configuracion } from '../lib/interfaces';
import { ConnectionPool } from 'mssql';
import { materialesControladores } from '../controllers/materiales-control';
import { loginControladores } from '../controllers/login-control';

export const rutasMateriales = (configENV: Configuracion, pool: ConnectionPool): {router:Router, ruta: string} => {
    const router = Router();
    const ruta = '/materiales';

    const controladores = materialesControladores(configENV, pool);

    const controladoresAuth = loginControladores(configENV, pool);

    router.get('/', (req, res) => {
        res.send({mensaje: 'Rutas de materiales'});
    });

    router.post('/getVariantesMaterialFiltro', controladores.getVariantesMaterialFiltro);

    router.post('/getMaterialFisicosFiltro', controladores.getMaterialFisicosFiltro);

    router.post('/crearTipoMaterial', controladores.crearTipoMaterial);

    router.post('/crearSubTipoMaterial', controladores.crearSubTipoMaterial);

    router.post('/editarSubTipo', controladores.editarSubTipo);

    router.post('/editarMaterial', controladores.editarMaterial);

    router.post('/crearMaterialDefinido', controladores.crearMaterialDefinido);

    router.post('/crearMaterialFisico', controladores.crearMaterialFisico);

    router.post('/editarMaterialDefinido', controladores.editarMaterialDefinido);

    router.post('/crearMaterial', controladores.crearMaterial);

    router.post('/editarTipo', controladores.editarTipo);

    router.get('/getAllTipos', controladoresAuth.loginRequired, controladores.getAllTipos);
 
    router.get('/getTipo/:codTipoMaterial', controladores.getTipo);

    router.get('/getMaterial/:codMaterial', controladores.getMaterial);

    router.get('/getSubTipo/:codSubTipoMaterial', controladores.getSubTipo);

    router.get('/getMaterialDefinido/:codMaterialDefinido', controladores.getMaterialDefinido);

    return { router, ruta };
};