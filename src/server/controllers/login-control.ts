import sql from 'mssql';
import { Response, Request, NextFunction } from 'express';
import { Usuario, Configuracion, InfoContacto, PersonaNatural } from '../lib/interfaces';
import { darDeAltaUsuarioSQL, darDeBajaUsuarioSQL, eliminarUsuarioSQL, getUsuarioSQL, insertarUsuario, reHabilitarUsuarioSQL, usuarioExisteLogin } from '../sql/sql-calls-strings';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const tiposBusqueda = ['M', 'S', 'U', 'D'];
export const tiposEliminar = [0, 1, 2];
const noCodERROR = new Error('Este Usuario No Existe');

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const loginControladores = (configENV: Configuracion, pool: sql.ConnectionPool) => {

    const registrar = async (req: Request, res: Response) => {
        try {

            const usuarioInfo = req.body.usuario as Usuario;
            const infoContactoInfo = req.body.infoContacto as InfoContacto;
            const personaNaturalInfo = req.body.personaNatural as PersonaNatural;

            if (!comprobarDatosRegistro(usuarioInfo, infoContactoInfo, personaNaturalInfo)) {
                const errorDeDatos = new Error('Datos incorrectos');
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            const hashContrasena = await bcrypt.hash(usuarioInfo.contrasena_enviada, 10);

            const result = await pool.request()
            .input('codDistrito', sql.VarChar(6), infoContactoInfo.codDistrito)
            .input('esAdmin', sql.Bit, usuarioInfo.esAdmin)
            .input('celular', sql.VarChar(15), infoContactoInfo.celular)
            .input('direccion_linea_uno', sql.VarChar(100), infoContactoInfo.direccion_linea_uno)
            .input('direccion_linea_dos', sql.VarChar(100), infoContactoInfo.direccion_linea_dos)
            .input('codigo_postal', sql.VarChar(15), infoContactoInfo.codigo_postal)
            .input('correo_electronico', sql.NVarChar(255), infoContactoInfo.correo_electronico)
            .input('DNI', sql.Char(8), personaNaturalInfo.DNI)
            .input('nombre', sql.VarChar(60), personaNaturalInfo.nombre)
            .input('apellido_uno', sql.VarChar(60), personaNaturalInfo.apellido_uno)
            .input('apellido_dos', sql.VarChar(60), personaNaturalInfo.apellido_dos)
            .input('fecha_nacimiento', sql.Date, personaNaturalInfo.fecha_nacimiento)
            .input('username', sql.VarChar(20), usuarioInfo.username)
            .input('contrasena', sql.Char(60), hashContrasena)
            .output('codUsuario', sql.Int)
            .output('error', sql.Int)
            .output('errorMSG', sql.VarChar(250))
            .execute(insertarUsuario);

            if (result.output.codUsuario === 0) {
                const errorDeDatos = new Error('Usuario o usuario con este DNI ya existe');
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Datos De Contacto Multiplicados' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }
            const usuarioRegistrado = result.recordset[0] as Usuario;
            usuarioRegistrado.contrasena = undefined;
            return res.json(usuarioRegistrado);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const getUsuario = async (req: Request, res: Response) => {
        try {

            const tipoDeBusqueda = (req.body.tipoDeBusqueda || 0) as number;
            
            if (!comprobarTipoDeBusqueda(tipoDeBusqueda)) {
                const errorDeDatos = new Error('Tipo De Busqueda Invalido');
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            const result = await pool.request()
            .input('tipoDeBusqueda', sql.Char(1), tiposBusqueda[tipoDeBusqueda])
            .input('codUsuario', sql.Int, req.body.codUsuario || null)
            .input('username', sql.VarChar(20), req.body.username || null)
            .input('DNI', sql.Char(8), req.body.DNI || null)
            .execute(getUsuarioSQL);

            if (result.recordset.length === 0) {
                const errorDeDatos = new Error('No se encontro el usuario');
                return mandarError(errorDeDatos, res, configENV, 404);
            }

            res.json(result.recordset.length === 1 ? result.recordset[0] : result.recordset);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const usuarioExiste = async (req: Request, res: Response) =>{
        try {
            console.log('d');
            const result = await pool.request()
            .input('tipoDeBusqueda', sql.Char(1), 'U')
            .input('codUsuario', sql.Int, null)
            .input('username', sql.VarChar(20), req.body.username)
            .input('DNI', sql.Char(8), null)
            .execute(getUsuarioSQL);

            res.json(result.recordset.length === 0 ? {existe: false} : {existe: true});

        } catch (error) {
            console.log(error);
            return mandarError(error, res, configENV, 500);
        }
    }

    const validarDNI = async (req: Request, res: Response) => {
        try {
            console.log(req.body.dni);
            const result = await axios.post('https://api.migo.pe/api/v1/dni', 
            { token: configENV.tokenSUNAT, dni: req.body.dni });
            res.json(result.data);
        } catch (error) {
            if (error.response.status) {
                return res.json({success: false});
            }
            return mandarError(error, res, configENV, 500);
        }
    }

    const darDeAltaUsuario = async (req: Request, res: Response) => {
        try {

            if (!req.body.codUsuario) {
                return mandarError(noCodERROR, res, configENV, 500);
            }

            const codUsuario = req.body.codUsuario;
            const codTrabajo = req.body.codTrabajo;

            const result = await pool.request()
            .input('codUsuario', sql.Int, codUsuario)
            .input('dado_alta', sql.Bit, true)
            .input('codTrabajo', sql.TinyInt, codTrabajo)
            .input('esAdmin', sql.Bit, req.body.esAdmin)
            .input('fecha_entrada', sql.Date, req.body.fecha_entrada || new Date())
            .output('error', sql.Int)
            .output('errorMSG', sql.VarChar(250))
            .execute(darDeAltaUsuarioSQL);

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Datos Multiplicados' : `Error ${result.output.errorMSG}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            if (result.recordset.length !== 1) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            return res.json(result.recordset[0]);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const reHabilitarUsuario = async (req: Request, res: Response) => {
        try {
            if (!req.body.codUsuario) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
    
            const codUsuario = req.body.codUsuario;
            const result = await pool.request()
            .input('codUsuario', sql.Int, codUsuario)
            .output('updated', sql.Bit)
            .execute(reHabilitarUsuarioSQL);
    
            if (!result.output.updated) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
    
            return res.json({mensaje: 'Usuario Rehabilidado'});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }

    };

    const darDeBajaUsuario = async (req: Request, res: Response) => {
        try {

            if (!req.body.codUsuario) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            const codUsuario = req.body.codUsuario;
            const result = await pool.request()
            .input('codUsuario', sql.Int, codUsuario)
            .output('updated', sql.Bit)
            .execute(darDeBajaUsuarioSQL);
            if (!result.output.updated) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            return res.json({mensaje: 'Usuario dado de baja'});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getDatosCompletosUsuario = async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.body.codUsuario) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            const codUsuario = req.body.codUsuario;

            const datosUsuario = await pool.request()
            .input('codUsuario', sql.Int, codUsuario)
            .execute('get_usuario_completo');

            if (datosUsuario.recordset.length !== 1) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            const datosCompletosUsuario = datosUsuario.recordset[0] as {codUsuario: string, DNI: string, codInfoContacto: string};
            res.locals.datosCompletosUsuario = datosCompletosUsuario;
            next();
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const eliminarUsuario = async (req: Request, res: Response) => {
        try {
            if (!req.body.codUsuario) {
                return mandarError(noCodERROR, res, configENV, 500);
            }
            const result = await pool.request()
            .input('codUsuario', sql.Int, req.body.codUsuario)
            .output('error', sql.Int)
            .output('errorMSG', sql.VarChar(200))
            .execute(eliminarUsuarioSQL);

            if (result.rowsAffected.length === 0) {
                return mandarError(noCodERROR, res, configENV, 500);
            }

            res.json({mensaje: 'Usuario eliminado'});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const comprobarUsuarioExisteLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.username) {
                const errorUsuarioInvalido = new Error('Usuario Invalido');
                return mandarError(errorUsuarioInvalido, res, configENV, 401);
            }
            const result = await pool.request()
            .input('username', sql.VarChar(20), req.body.username)
            .execute(usuarioExisteLogin);
            if (!(result.recordset.length === 1)) {
                const errorNoUser = new Error('El usuario no existe');
                return mandarError(errorNoUser, res, configENV, 401);
            }
            if ((result.recordset[0] as Usuario).dado_alta === false) {
                const errorNoAlta = new Error('El usuario no ha sido dado de alta');
                return mandarError(errorNoAlta, res, configENV, 401);
            }
            res.locals.usuario = result.recordset[0];
            console.log(res.locals.usuario.contrasena.toString());
            next();
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const comprobarContrasena = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const usuario = res.locals.usuario as Usuario;
            if ((req.body.contrasena_enviada as string).length < 6) {
                const errorContrasena = new Error('Contraseña Incorrecta');
                return mandarError(errorContrasena, res, configENV, 403);
            }
            const contrasena = usuario.contrasena.toString();
            const comparacion = await bcrypt.compare(req.body.contrasena_enviada, contrasena);
            if (!comparacion) {
                const errorContrasena = new Error('Contraseña Incorrecta');
                return mandarError(errorContrasena, res, configENV, 403);
            }
            next();
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const enviarTokenLogin = async (req: Request, res: Response) => {
        try {
            const usuario = res.locals.usuario as Usuario;
            usuario.contrasena_enviada = undefined;
            usuario.contrasena = undefined;
            const loginToken = 
            jwt.sign({ aud: `${usuario.codUsuario} ${usuario.username} ${usuario.esAdmin ? 'Administrador' : 'Personal'}`, 
            _id: usuario.codUsuario }, configENV.jwtKey);
            return res.json({usuario, loginToken});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const loginRequired = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!res.locals.usuario) {
                const error = new Error('Contenido protegido')
                return mandarError(error, res, configENV, 401);
            }
            next();
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const adminLoginRequired = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!res.locals.usuario || res.locals.usuario.aud.split(' ')[2] !== 'Administrador') {
                const error = new Error('Contenido protegido')
                return mandarError(error, res, configENV, 401);
            }
            next();
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    return { registrar, getUsuario, darDeAltaUsuario, darDeBajaUsuario, getDatosCompletosUsuario, enviarTokenLogin, validarDNI,
        eliminarUsuario, comprobarUsuarioExisteLogin, comprobarContrasena, reHabilitarUsuario, usuarioExiste, loginRequired, adminLoginRequired };
};

const mandarError = (error: Error, res: Response, configENV: Configuracion, numeroError: number) => {
    configENV.log().error(error);
    return res.status(numeroError).json({error: error.message});
};

export const comprobarDatosRegistro = (usuario: Usuario, infoContacto: InfoContacto, personaNatural: PersonaNatural): boolean => {
    if (!comprobarUsuario(usuario) || !comprobarInfoContacto(infoContacto) || !comprobarPersonaNatural(personaNatural)) {
        return false;
    }
    return true;
}

const comprobarUsuario = (usuario: Usuario) => {
    const letterNumber = /^[0-9a-zA-Z]+$/;
    if ((usuario.username.length > 20 || usuario.username.length < 3) && !usuario.username.match(letterNumber)) {
        return false;
    }
    if (!usuario.contrasena_enviada.match(letterNumber)) {
        return false;
    }
    return true;
}

const comprobarInfoContacto = (infoContacto: InfoContacto) => {
    const onlyNumber = /^[0-9]+$/;
    if (!infoContacto.celular.match(onlyNumber) && infoContacto.celular.length > 15) {
        return false;
    }
    if (infoContacto.correo_electronico.length > 255) {
        return false;
    }
    if (infoContacto.direccion_linea_uno.length > 100) {
        return false;
    }
    if (infoContacto.direccion_linea_dos && infoContacto.direccion_linea_dos.length > 100) {
        return false;
    }
    return true;
};

const comprobarPersonaNatural = (personaNatural: PersonaNatural) => {
    const onlyNumber = /^[0-9]+$/;
    if (personaNatural.DNI.length !== 8 && personaNatural.DNI.match(onlyNumber)) {
        return false;
    }
    return true;
};

export const comprobarTipoDeBusqueda = (tipo: number): boolean => {
    if (tipo >= 0  && tiposBusqueda.length > tipo) {
        return true;
    }
    return false;
}

export const comprobarTipoEliminar = (tipo: number): boolean => {
    if (tiposEliminar.indexOf(tipo) === -1) {
        return false;
    }
    return true;
};