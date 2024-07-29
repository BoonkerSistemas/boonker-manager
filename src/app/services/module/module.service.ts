import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {AuthService} from "../../core/auth/auth.service";
import {UsuarioDto} from "../../dtos/usuario.dto";
import {UpdateResultDto} from "../../dtos/update-result.dto";
import {InsertResultDto} from "../../dtos/insert-result.dto";

@Injectable({
    providedIn: "root",
})
export class ModuleService {
    private nombreModelo = "purchase-order";

    constructor(
        private readonly httpClientService: HttpClient,
        private readonly autenticacionService: AuthService
    ) {
    }

    create(objeto: any): Observable<any> {
        const url = environment.url + this.nombreModelo;
        return this.httpClientService.post<InsertResultDto>(url, objeto);
    }

    findAll(): Observable<any[]> {

        return this.httpClientService.get<UsuarioDto[]>(
            environment.url + this.nombreModelo
        );
    }

    findOneById(id: string): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + "/" + id
        );
    }

    updateOneById(objeto: any): Observable<UpdateResultDto> {
        const url = environment.url + this.nombreModelo + "/" + objeto._id;

        return this.httpClientService.patch<UpdateResultDto>(url, objeto);
    }

    findAllStatus(status): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + `/status/${status}`
        );
    }

    delete(objeto: any): Observable<any> {
        return this.httpClientService.delete<any>(
            environment.url + this.nombreModelo + `/${objeto._id}`
        );
    }



}
