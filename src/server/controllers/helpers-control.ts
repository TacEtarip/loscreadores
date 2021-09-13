import sql from 'mssql';
import { Response, Request } from 'express';
import { Color, Configuracion, Departamento, Distrito, Marca, Proveedor, Provincia, Trabajo, UnidadDeMedida } from '../lib/interfaces';
import { agregarColorProcedure, getColorProcedure, getTodosLosColores, modificarColorProcedure } from '../sql/sql-calls-strings';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const helpersControladores = (configENV: Configuracion, pool: sql.ConnectionPool) => {
    const getColores = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().query(getTodosLosColores);
            const colores = result.recordset as Color[];
            return res.json(colores);
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
            await pool.request()
            .input('hex_code', sql.Char(6), color.hex_code)
            .input('nombre', sql.VarChar(20), color.nombre).execute(agregarColorProcedure);
            res.json({mensaje: 'Color Agregado'});
        } catch (error) {
            mandarError(error, res, configENV, 500);
        }
    };

    const modificarColor = async (req: Request, res: Response) => {
        try {
            const color = req.body.color as Color;

            await pool.request()
            .input('codColor', sql.TinyInt, color.codColor)
            .input('hex_code', sql.Char(6), color.hex_code)
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
            res.json(result.recordset[0] as Trabajo);   
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getDepartamentos = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().execute('listado_departamentos');
            if (result.recordset.length === 0) {
                return mandarError(new Error('No se encontraron departamentos'), res, configENV, 401);
            }
            const departamentos = result.recordset as Departamento[];
            return res.json(departamentos);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const getProvincias = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().input('codDepartamento', sql.VarChar(2), req.body.codDepartamento)
            .execute('listado_provincias');
            if (result.recordset.length === 0) {
                return mandarError(new Error('No se encontraron provincias'), res, configENV, 401);
            }
            const provincias = result.recordset as Provincia[];
            return res.json(provincias);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }
    
    const getProveedores = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .execute('get_proveedores');
            const proveedores = (result.recordset || []) as Proveedor[];
            return res.json(proveedores);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const getDistritos = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().input('codProvincia', sql.VarChar(4), req.body.codProvincia)
            .execute('listado_distritos');
            if (result.recordset.length === 0) {
                return mandarError(new Error('No se encontraron distritos'), res, configENV, 401);
            }
            const distritos = (result.recordset || []) as Distrito[];
            return res.json(distritos);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const getUnidadesDeMedida = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .execute('get_unidades_de_medida');
            const unidadesDeMedida = (result.recordset || []) as UnidadDeMedida[];
            return res.json(unidadesDeMedida);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const agregarMarca = async (req: Request, res: Response) => {
        try {
            if (!req.body.nombre) {
                const error = new Error('No se entrego un nombre')
                return mandarError(error, res, configENV, 500);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(20), req.body.nombre)
            .input('logo', sql.VarChar(500), req.body.logo)
            .input('info_extra', sql.VarChar(sql.MAX), req.body.info_extra)
            .output('error', sql.Int)
            .output('codMarca', sql.TinyInt)
            .execute('add_marca')
            if (result.output.error) {
                const error = new Error('Esta Marca Ya Existe')
                return mandarError(error, res, configENV, 500);
            }
            return res.json({codMarca: result.output.codMarca, nombre: req.body.nombre, logo: req.body.logo, info_extra: req.body.info_extra});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }

    const getMarcas = async (req: Request, res: Response) => {
        try {
            const result = await pool.request().execute('get_marcas');
            const marcas = result.recordset as Marca[];
            res.json(marcas);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    return { getColores, insertarColor, modificarColor, getColor, insertarTrabajo, getMarcas, getProveedores,
        getDepartamentos, getProvincias, getDistritos, getUnidadesDeMedida, agregarMarca };
};

const mandarError = (error: Error, res: Response, configENV: Configuracion, numeroError: number) => {
    configENV.log().error(error);
    return res.status(numeroError).json({error: error.message});
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