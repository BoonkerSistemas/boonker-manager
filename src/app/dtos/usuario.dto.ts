//import { RolDto } from './rol.dto';

export interface UsuarioDto {
    avatar: string;
    name: string;
    id: string;
    fechaHoraRegistro: string;
    fechaHoraActualizacion: string;
    cedula: string;
    nombre: string;
    apellido: string;
    nickname: string;
    fechaNacimiento: string;
    numeroContacto: string;
    email: string;
    estado: boolean;
    linkpicture: string;
    direccion: string;
    idRol: number;
    //rol: RolDto;
    role?: string;
    rol: number;
    id_tipoSangre: number;
    id_genero: number;
    fecha_hora_ultima_conexion?: string;
    password: string;
}

export class CrearUsuarioDto {
    cedula: string;
    nombre: string;
    apellido: string;
    numeroContacto: string;
    email: string;
    nickname: string;
    password: string;
    estado: boolean;
    //nombreFoto: string;
    idRol: number;
    fecha_hora_ultima_conexion?: string;
    //empresa?: string;
}

export class EditarUsuarioDto {
    id: number;
    cedula: string;
    nombre: string;
    apellido: string;
    numeroContacto: string;
    email: string;
    nickname: string;
    nombreFoto: string;
    idRol: number;
    fecha_hora_ultima_conexion?: string;
    empresa?: string;
}
