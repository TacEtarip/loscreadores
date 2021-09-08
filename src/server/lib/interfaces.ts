import Logger from 'bunyan';

export interface Color {
    codColor?: number;
    hex_code: string;
    nombre: string;
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
    nombre: string;
    ultima_actualizacion: Date;
    deleted: boolean;
}