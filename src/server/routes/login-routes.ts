import { Router } from 'express';
import { Configuracion } from '../lib/interfaces';
import { ConnectionPool } from 'mssql';
import { loginControladores } from '../controllers/login-control';

export const rutasLogin = (configENV: Configuracion, pool: ConnectionPool): {router:Router, ruta: string} => {
    const router = Router();
    const ruta = '/auth';

    const controladores = loginControladores(configENV, pool);

    router.get('/', (req, res) => {
        res.send({mensaje: 'Rutas de login'});
    });

    router.post('/getUsuario', controladores.getUsuario);

    router.post('/darDeAltaUsuario', controladores.darDeAltaUsuario);

    router.post('/darDeBajaUsuario', controladores.darDeBajaUsuario);

    router.post('/reHabilitarUsuario', controladores.reHabilitarUsuario);

    router.post('/eliminarUsuario', controladores.eliminarUsuario);

    router.post('/registrar', controladores.adminLoginRequired, controladores.registrar);

    router.post('/usuarioExiste', controladores.usuarioExiste);

    router.post('/validarDNI', controladores.validarDNI);

    router.post('/login', controladores.comprobarUsuarioExisteLogin, controladores.comprobarContrasena, controladores.enviarTokenLogin);

    return { router, ruta };
};