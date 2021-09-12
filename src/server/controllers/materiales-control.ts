import sql from 'mssql';
import { Response, Request } from 'express';
import { Configuracion } from '../lib/interfaces';


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const materialesControladores = (configENV: Configuracion, pool: sql.ConnectionPool) => {
    const crearTipoMaterial = async (req: Request, res: Response) => {
        try{
            if(!esNombreTipoValido(req.body.tipoNombre)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(50), req.body.tipoNombre)
            .output('error', sql.Int)
            .output('codTipoMaterial', sql.SmallInt)
            .execute('add_tipo_material');
            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de tipo ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            } 
            return res.json({message: 'Tipo Añadido', 
            nuevoTipo: {codTipoMaterial: result.output.codTipoMaterial, nombre: req.body.tipoNombre, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const crearSubTipoMaterial = async (req: Request, res: Response) => {
        try{
            if (!comprobarNoSonNulos(req.body.subTipoNombre, req.body.codTipoMaterial)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            if(!esNombreTipoValido(req.body.subTipoNombre)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(50), req.body.subTipoNombre)
            .input('codTipoMaterial', sql.SmallInt, req.body.codTipoMaterial)
            .output('error', sql.Int)
            .output('codSubTipoMaterial', sql.SmallInt)
            .execute('add_sub_tipo_material');
            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de tipo ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            } 
            return res.json({message: 'Tipo Añadido', 
            nuevoSubTipo: {codSubTipoMaterial: result.output.codSubTipoMaterial, nombre: req.body.subTipoNombre, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const crearMaterial = async (req: Request, res: Response) => {
        try{
            if (!comprobarNoSonNulos(req.body.nombreMaterial, req.body.codSubTipoMaterial, req.body.descripcion, req.body.unidad_medida, req.body.unidad_medida_uso)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            if(!esNombreTipoValido(req.body.nombreMaterial)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(80), req.body.nombreMaterial)
            .input('codSubTipoMaterial', sql.SmallInt, req.body.codSubTipoMaterial)
            .input('descripcion', sql.VarChar(sql.MAX), req.body.descripcion)
            .input('unidad_medida', sql.VarChar(3), req.body.unidad_medida)
            .input('unidad_medida_uso', sql.VarChar(3), req.body.unidad_medida_uso)
            .output('error', sql.Int)
            .output('codMaterial', sql.Int)
            .execute('add_material');
            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de material ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            } 
            return res.json({message: 'Material Añadido', 
            nuevoMaterial: {codMaterial: result.output.codMaterial, nombre: req.body.nombreMaterial, descripcion: req.body.descripcion, 
                unidad_medida: req.body.unidad_medida, unidad_medida_uso: req.body.unidad_medida_uso, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    }; 

    const crearMaterialDefinido = async (req: Request, res: Response) => {
        try{
            if (!comprobarNoSonNulos(req.body.nombre, req.body.codMaterial, req.body.codColor, 
                req.body.codMarca, req.body.precio_por_unidad, req.body.descripcion)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            
            const result = await pool.request()
            .input('nombre', sql.VarChar(50), req.body.nombre)
            .input('codMaterial', sql.SmallInt, req.body.codMaterial)
            .input('codColor', sql.TinyInt, req.body.codColor) 
            .input('codMarca', sql.TinyInt, req.body.codMarca)
            .input('precio_por_unidad', sql.Decimal(19, 4), req.body.precio_por_unidad)
            .input('descripcion', sql.VarChar(sql.MAX), req.body.descripcion)
            .input('colorNuevo', sql.Bit, req.body.codColor == 0 ? true : false)
            .input('nombreColor', sql.VarChar(20), req.body.nombreColor)
            .input('hex_code', sql.Char(6), req.body.hex_code)
            .output('error', sql.Int)
            .output('codMaterialDefinido', sql.Int)
            .execute('add_material_definido');

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de material ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            } 
            return res.json({message: 'Variante Añadido', nuevaVariante: result.recordset[0]});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const crearMaterialFisico = async (req: Request, res: Response) => {
        try{
            if (!comprobarNoSonNulos(req.body.codMaterialDefinido, 
                req.body.cantidad_original, req.body.cantidad_gastada, req.body.codProveedor, req.body.valor)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }

            const result = await pool.request()
            .input('codUsuario', sql.Int, res.locals.usuario.aud.split(' ')[0])
            .input('codMaterialDefinido', sql.Int, req.body.codMaterialDefinido)
            .input('cantidad_original', sql.Decimal(12, 2), req.body.cantidad_original)
            .input('cantidad_gastada', sql.Decimal(12, 2), req.body.cantidad_gastada) 
            .input('codProveedor', sql.Int, req.body.codProveedor)
            .input('valor', sql.Decimal(19, 4), req.body.valor)
            .input('cod_factura', sql.VarChar(15), req.body.cod_factura)
            .input('comentario', sql.VarChar(sql.MAX), req.body.comentario)
            .output('error', sql.Int)
            .output('codMaterialFisico', sql.Int)
            .output('codIngresoMaterial', sql.Int)
            .execute('agregar_material_fisico');

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de material ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            } 
            return res.json({message: 'Producto Material Añadido', nuevoProductoMaterial: result.recordset[0]});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getAllTipos = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codTipoMaterial', sql.SmallInt, null)
            .execute('get_tipo_material');
            return res.json(result.recordset);
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };
    
 
    const getTipo = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codTipoMaterial', sql.SmallInt, req.params.codTipoMaterial)
            .execute('get_tipo_material');
            if (result.recordsets[0].length === 0) {
                const errorNoMaterial = new Error('Este tipo de material no existe');
                return mandarError(errorNoMaterial, res, configENV, 404);
            }
            return res.json({...result.recordsets[0][0],  subTipos: result.recordsets[1] || []}); 
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getMaterial = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codMaterial', sql.SmallInt, req.params.codMaterial)
            .execute('get_material');
            if (result.recordsets[0].length === 0) {
                const errorNoMaterial = new Error('Este material no existe');
                return mandarError(errorNoMaterial, res, configENV, 404);
            }
            return res.json({...result.recordsets[0][0],  variantes: result.recordsets[1] || []}); 
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getVariantesMaterialFiltro = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codMaterial', sql.Int, req.body.codMaterial)
            .input('codColor', sql.Int, req.body.codColor || null)
            .input('codMarca', sql.Int, req.body.codMarca || null)
            .input('precioMin', sql.Decimal(19, 4), req.body.precioMin || null)
            .input('precioMax', sql.Decimal(19, 4), req.body.precioMax || null)
            .input('texto', sql.VarChar(40), req.body.texto || null)
            .execute('get_variantes_filtro');
            return res.json({variantes: result.recordsets[0] || []}); 
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const getMaterialFisicosFiltro = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codMaterialDefinido', sql.Int, req.body.codMaterialDefinido)
            .input('estado', sql.TinyInt, req.body.estado || 1)
            .input('codProveedor', sql.Int, req.body.codProveedor == -1 ? null : req.body.codProveedor)
            .input('desde_fecha', sql.Date, req.body.desde_fecha || null)
            .input('hasta_fecha', sql.Date, req.body.hasta_fecha || null)
            .execute('get_material_fisico_filtro');
            return res.json({materialesFisicos: result.recordsets[0] || []}); 
        } catch (error) { 
            return mandarError(error, res, configENV, 500);
        }
    };

    const getMaterialDefinido = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codMaterialDefinido', sql.SmallInt, req.params.codMaterialDefinido)
            .execute('get_material_definido');
            if (result.recordsets[0].length === 0) {
                const errorNoMaterial = new Error('Este material no existe');
                return mandarError(errorNoMaterial, res, configENV, 404);
            }
            return res.json({...result.recordsets[0][0],  materialesProductos: result.recordsets[1] || []}); 
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };



    const getSubTipo = async (req: Request, res: Response) => {
        try {
            const result = await pool.request()
            .input('codSubTipoMaterial', sql.SmallInt, req.params.codSubTipoMaterial)
            .execute('get_sub_tipo_material');
            if (result.recordsets[0].length === 0) {
                const errorNoMaterial = new Error('Este sub tipo de material no existe');
                return mandarError(errorNoMaterial, res, configENV, 404);
            }
            return res.json({...result.recordsets[0][0],  materiales: result.recordsets[1] || []}); 
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const editarTipo = async (req: Request, res: Response) => {
        try {
            if (!comprobarNoSonNulos(req.body.codTipoMaterial, req.body.tipoNombre)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            if(!esNombreTipoValido(req.body.tipoNombre)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            if (!req.body.codTipoMaterial) {
                const errorInvalidoCod = new Error('Codigo Invalido');
                return mandarError(errorInvalidoCod, res, configENV, 400);
            }
            const result = await pool.request()
            .input('codTipoMaterial', sql.SmallInt, req.body.codTipoMaterial)
            .input('nombre', sql.VarChar(50), req.body.tipoNombre)
            .output('error', sql.Int)
            .execute('update_tipo_material');

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de tipo ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }
            return res.json({message: 'Tipo Actualizado',
            nuevoTipo: {codTipoMaterial: req.body.codTipoMaterial, nombre: req.body.tipoNombre, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const editarMaterial = async (req: Request, res: Response) => {
        try {
            if (!comprobarNoSonNulos(req.body.nombreMaterial, req.body.codMaterial, req.body.descripcion, req.body.unidad_medida, req.body.unidad_medida_uso)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            if(!esNombreTipoValido(req.body.nombreMaterial)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            if (!req.body.codMaterial) {
                const errorInvalidoCod = new Error('Codigo Invalido');
                return mandarError(errorInvalidoCod, res, configENV, 400);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(80), req.body.nombreMaterial)
            .input('descripcion', sql.VarChar(sql.MAX), req.body.descripcion)
            .input('unidad_medida', sql.VarChar(3), req.body.unidad_medida)
            .input('unidad_medida_uso', sql.VarChar(3), req.body.unidad_medida_uso)
            .input('codMaterial', sql.Int, req.body.codMaterial)
            .output('error', sql.Int)
            .execute('update_material');

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de tipo ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }
            return res.json({message: 'Material Actualizado',
            nuevoMaterial: {codMaterial: req.body.codMaterial, nombre: req.body.nombreMaterial, descripcion: req.body.descripcion, 
                unidad_medida: req.body.unidad_medida, unidad_medida_uso: req.body.unidad_medida_uso, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const editarMaterialDefinido = async (req: Request, res: Response) => {
        try {
            if (!comprobarNoSonNulos(req.body.nombre, req.body.codMaterialDefinido, req.body.codColor, req.body.codMarca, req.body.precio_por_unidad, req.body.descripcion)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            const result = await pool.request()
            .input('nombre', sql.VarChar(50), req.body.nombre)
            .input('codMaterialDefinido', sql.Int, req.body.codMaterialDefinido)
            .input('codColor', sql.TinyInt, req.body.codColor) 
            .input('codMarca', sql.TinyInt, req.body.codMarca)
            .input('precio_por_unidad', sql.Decimal(19, 4), req.body.precio_por_unidad)
            .input('descripcion', sql.VarChar(sql.MAX), req.body.descripcion)
            .input('colorNuevo', sql.Bit, req.body.codColor == 0 ? true : false)
            .input('nombreColor', sql.VarChar(20), req.body.nombreColor)
            .input('hex_code', sql.Char(6), req.body.hex_code)
            .output('error', sql.Int)
            .execute('update_material_definido');

            if (result.output.error) {
                const errorDeDatos = new Error(`Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            if (!result.recordset[0]) {
                const errorDeDatos = new Error(`No se encontro la variacion`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }

            return res.json({message: 'Variante Actualizada', nuevaVariante: result.recordset[0]});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    const editarSubTipo = async (req: Request, res: Response) => {
        
        try {
            if (!comprobarNoSonNulos(req.body.subTipoNombre, req.body.codSubTipoMaterial)) {
                const error = new Error('Datos enviados incorrectamente');
                return mandarError(error, res, configENV, 400);
            }
            if(!esNombreTipoValido(req.body.subTipoNombre)) {
                const errorInvalido = new Error('Nombre Invalido');
                return mandarError(errorInvalido, res, configENV, 400);
            }
            if (!req.body.codSubTipoMaterial) {
                const errorInvalidoCod = new Error('Codigo Invalido');
                return mandarError(errorInvalidoCod, res, configENV, 400);
            }
            const result = await pool.request()
            .input('codSubTipoMaterial', sql.SmallInt, req.body.codSubTipoMaterial)
            .input('nombre', sql.VarChar(50), req.body.subTipoNombre)
            .output('error', sql.Int)
            .execute('update_sub_tipo_material');

            if (result.output.error) {
                const errorDeDatos = new Error(result.output.error === 2627 ? 'Este nombre de tipo ya existe' : `Error ${result.output.error}`);
                return mandarError(errorDeDatos, res, configENV, 400);
            }
            return res.json({message: 'Tipo Actualizado',
            nuevoSubTipo: {codSubTipoMaterial: req.body.codSubTipoMaterial, nombre: req.body.subTipoNombre, deleted: false}});
        } catch (error) {
            return mandarError(error, res, configENV, 500);
        }
    };

    return {crearTipoMaterial, getAllTipos, getTipo, editarTipo, crearSubTipoMaterial, getMaterial, crearMaterialFisico,
        editarSubTipo, getSubTipo, crearMaterial, getVariantesMaterialFiltro, getMaterialFisicosFiltro,
        editarMaterial, crearMaterialDefinido, editarMaterialDefinido, getMaterialDefinido};
}

export const esNombreTipoValido = (nombreTipo: string): boolean => {
    if (nombreTipo.length < 50) {
        return true;
    }
    return false
};

const mandarError = (error: Error, res: Response, configENV: Configuracion, numeroError: number) => {
    configENV.log().error(error);
    return res.status(numeroError).json({error: error.message});
};


const comprobarNoSonNulos = (...valores: unknown[]) => {
    for (let index = 0; index < valores.length; index++) {
        if (valores[index] === null || valores[index] === undefined || valores[index] === '') {
            return false;
        }
    }
    return true;
}