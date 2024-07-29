import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {AuthService} from "../../core/auth/auth.service";
import {CrearUsuarioDto, UsuarioDto} from "../../dtos/usuario.dto";
import {UpdateResultDto} from "../../dtos/update-result.dto";
import {InsertResultDto} from "../../dtos/insert-result.dto";

@Injectable({
    providedIn: "root",
})
export class TerminosCondicionesService {
    private nombreModelo = "terms-conditions";

    constructor(
        private readonly httpClientService: HttpClient,
        private readonly autenticacionService: AuthService
    ) {
    }

    create(objeto: CrearUsuarioDto): Observable<InsertResultDto> {
        const url = environment.api_url + this.nombreModelo;
        return this.httpClientService.post<InsertResultDto>(url, objeto);
    }

    findAll(): Observable<UsuarioDto[]> {
        
        return this.httpClientService.get<UsuarioDto[]>(
            environment.api_url + this.nombreModelo
        );
    }

    findLogueado(): Observable<UsuarioDto[]> {
        const url = environment.api_url + "/usuario/logueado/user";
        //const headers = new HttpHeaders({Authorization: this.autenticacionService.sesionDto.accessToken});
        return this.httpClientService.get<UsuarioDto[]>(url);
    }

    findOneById(id: number | string): Observable<UsuarioDto> {
        const url = environment.api_url + this.nombreModelo + "/id/" + id;
        
        return this.httpClientService.get<UsuarioDto>(url);
    }

    findOneByNick(nick: string): Observable<UsuarioDto> {
        const url = environment.api_url + this.nombreModelo + "/" + nick;
        return this.httpClientService.get<UsuarioDto>(url);
    }

    updateOneById(objeto: any): Observable<UpdateResultDto> {
        const url = environment.api_url + this.nombreModelo + "/" + objeto._id;
        
        return this.httpClientService.patch<UpdateResultDto>(url, objeto);
    }

    putEstado(id: number, estado: boolean) {
        
        return this.httpClientService.put<UpdateResultDto>(
            environment.api_url + this.nombreModelo + "/" + id,
            {estado}
        );
    }

    delete(id: number | string): Observable<UsuarioDto> {
        return this.httpClientService.delete<UsuarioDto>(
            environment.api_url + this.nombreModelo + `/${id}`
        );
    }
}
