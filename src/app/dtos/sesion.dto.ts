import {UsuarioDto} from './usuario.dto';

export interface SessionDto {
    jsonRes: SessionDto;
  token: string;
  user: UsuarioDto;
}
