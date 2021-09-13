import Logger from 'bunyan';

export interface Color {
    codColor?: number;
    hex_code: string;
    nombre: string;
}

export interface UnidadDeMedida {
    codUnidadDeMedida: string; 
    nombre: string;
    ultima_actualizacion: Date;
}

export interface Proveedor {
    codProveedor?: number;
    rating?: number;
    activo: boolean;
    deleted: boolean;
    DNI?: string;
    RUC?: string;
    nombrePersonaJuridica?: string;
    nombrePersonaNatural?: string;
}

export interface Marca {
    codMarca?: string;
    nombre: string;
    logo?: string;
    info_extra?: string;
}

export interface Configuracion {
    PORT: string,
    link: string;
    servidorSQL: string;
    usuarioSQL: string;
    passwordSQL: string;
    baseDeDatosSQL: string;
    jwtKey: string;
    tokenSUNAT: string;
    log: () => Logger;
}

export interface Usuario {
    codUsuario?: number;
    DNI?: string;
    username: string;
    contrasena_enviada?: string;
    contrasena?: BinaryType;
    ultima_actualizacion?: Date;
    fecha_creacion?: Date;
    deleted?: boolean;
    dado_alta?: boolean;
    esAdmin: boolean;
}

export interface PersonaNatural {
    DNI: string;
    nombre: string;
    apellido_uno: string;
    apellido_dos: string;
    fecha_nacimiento: Date;
    ultima_actualizacion?: Date;
    codInfoContacto?: number;
    deleted?: boolean;
}

export interface InfoContacto {
    codInfoContacto?: number;
    codDistrito: string;
    celular: string;
    direccion_linea_uno: string;
    direccion_linea_dos?: string;
    codigo_postal?: string;
    correo_electronico: string;
    ultima_ctualizacion?: Date;
    deleted?: boolean;
}


export interface Distrito {
    codDistrito: string;
    codProvincia: string;
    codDepartamento: string;
    nombre: string;
}


export interface Provincia {
    codProvincia: string;
    codDepartamento: string;
    nombre: string;
}

export interface Departamento {
    codDepartamento: string;
    codPais: number;
    nombre: string;
}

export interface Pais {
    codPais: number;
    iso: string;
    nombre: string;
    nombre_show: string;
    iso3: string;
    numero_codigo: number;
    codigo_telefono: number;
}

export interface Trabajo {
    codTrabajo?: number;
    titulo: string;
    pago: number;
    ultima_actualizacion?: Date;
    deleted?: boolean;
}

export interface TipoMaterial {
    codTipoMaterial?: number;
    nombre: string;
    ultima_actualizacion: Date;
    deleted: boolean;
}

export interface SubTipoMaterial {
    codSubTipoMaterial?: number;
    nombreTipo?: string;
    codTipoMaterial?: number;
    nombre: string;
    ultima_actualizacion: Date;
    deleted: boolean;
}

export interface Material {
    codMaterial?: number;
    codSubTipoMaterial?: number;
    nombreSubTipo?: string;
    codTipoMaterial?: number;
    nombreTipo?: string;
    nombre: string;
    ultima_actualizacion: Date;
    deleted: boolean;
    descripcion: string;
    unidad_medida: string;
    unidad_medida_uso: string;
} 
 
export interface MaterialDefinido {
    codMaterialDefinido?: number;
    codMaterial?: number;
    nombreMaterial?: string;
    codSubTipoMaterial?: number;
    nombreSubTipo?: string;
    codTipoMaterial?: number;
    nombreTipo?: string;
    codColor: number;
    codMarca: number;
    precio_por_unidad: number;
    descripcion: string;
    deleted: boolean;
    ultima_actualizacion: string;
    nombre: string;
    nombreColor?: string;
    hex_code?: string;
    nombreMarca?: string;
    unidad_medida_uso?: string;
}

export interface MaterialFisico {
    codMaterialFisico: number;
    codMaterialDefinido: number;
    deleted: boolean;
    ultima_actualizacion: Date;
    cantidad_original: number;
    cantidad_gastada: number;
    dia_de_ingreso: Date;
}