import * as sql from 'mssql';
import { Response, Request } from 'express';
import { Color, Configuracion, Trabajo } from '../lib/interfaces';
import { agregarColorProcedure, getColorProcedure, getTodosLosColores, modificarColorProcedure } from '../sql/sql-calls-strings';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const helpersControladores = (configENV: Configuracion, pool: sql.ConnectionPool) => {
    const getColores = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().query(getTodosLosColores);
            return res.json(result.recordset as Color[]);
        } catch (error) {
            mandarError(error, res, configENV, 500);
        }
    };
    
    const getColor = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().input('codColor', sql.TinyInt, req.params.codColor).execute(getColorProcedure);
            return res.json((result.recordset as Color[])[0]);
        } catch (error) {
            mandarError(error, res, configENV, 500);
        }
    };
    const insertarColor = async (req: Request, res: Response) => {
        try {
            const color = req.body.color as Color;
            if (!comprobarColor(color)) {
                const errorDeColor = new Error('Color Invalido');
                return mandarError(errorDeColor, res, configENV, 400);
            }
            await pool.request()
            .input('R', sql.TinyInt, color.R).input('G', sql.TinyInt, color.G)
            .input('B', sql.TinyInt, color.B).input('hex_code', sql.Char(6), color.hex_code)
            .input('nombre', sql.VarChar(20), color.nombre).execute(agregarColorProcedure);
            res.json({mensaje: 'Color Agregado'});
        } catch (error) {
            mandarError(error, res, configENV, 500);
        }
    };

    const modificarColor = async (req: Request, res: Response) => {
        try {
            const color = req.body.color as Color;
            if (!comprobarColor(color)) {
                const errorDeColor = new Error('Color Invalido');
                return mandarError(errorDeColor, res, configENV, 400);
            }
            await pool.request()
            .input('codColor', sql.TinyInt, color.codColor).input('R', sql.TinyInt, color.R).input('G', sql.TinyInt, color.G)
            .input('B', sql.TinyInt, color.B).input('hex_code', sql.Char(6), color.hex_code)
            .input('nombre', sql.VarChar(20), color.nombre).execute(modificarColorProcedure);
            res.json({mensaje: 'Color Modificado'});
        } catch (error) {
            mandarError(error, res, configENV, 500);
        }
    };

    const insertarTrabajo = async (req: Request, res: Response) => {
        try {
            const trabajo = req.body.trabajo as Trabajo;
            if (!comprobarTrabajo(trabajo)) {
                const errorDeTrabajo = new Error('Datos enviados incorrectos');
                return mandarError(errorDeTrabajo, res, configENV, 400);
            }
            const result = await pool.request()
            .input('titulo', sql.VarChar(40), trabajo.titulo)
            .input('pago', sql.Decimal(19, 4), trabajo.pago)
            .execute('insertar_trabajo');
            if (result.recordset.length !== 1) {
                return mandarError(new Error('Error Al Insertar'), res, configENV, 500);
            }
            res.json(result.recordset[0]);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    return { getColores, insertarColor, modificarColor, getColor, insertarTrabajo };
};

const mandarError = (error: Error, res: Response, configENV: Configuracion, numeroError: number) => {
    configENV.log().error(error);
    return res.status(numeroError).json({error: error.message});
};

export const comprobarColor = (color: Color): boolean => {
    if (color.R > 255 || color.G > 255 || color.B > 255) {
        return false;
    }
    if (color.nombre.length > 20 || color.hex_code.length > 6) {
        return false;
    }
    return true;
};

export const comprobarTrabajo = (trabajo: Trabajo): boolean => {
    if (trabajo.pago && trabajo.pago > 0) {
        return true;
    }
    if (trabajo.titulo && trabajo.titulo.length <= 40) {
       return true; 
    }
    return false;
};