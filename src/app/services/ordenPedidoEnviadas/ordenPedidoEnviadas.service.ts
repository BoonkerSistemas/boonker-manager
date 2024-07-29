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
export class OrdenPedidoEnviadasService {
    private nombreModelo = "send-product";

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

    findOneById(id): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + "/order/" + id
        );
    }

    findOne(id): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + "/" + id
        );
    }

    findOneDocument(id, type): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + "/documentproject/" + id + '/' + type
        );
    }

    findOnePersonal(id, type): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + "/user/" + id
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

    findAllStatusProject(status): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + `/statusproject/${status}`
        );
    }

    findProject(id): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + `/user/${id}`
        );
    }


    delete(objeto: any): Observable<any> {
        return this.httpClientService.delete<any>(
            environment.url + this.nombreModelo + `/${objeto._id}`
        );
    }

    generarDetallesMateriales(body): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = 'https://1s4s9m33pj.execute-api.us-east-1.amazonaws.com/dev/ordenpedido/generar';
        return this.httpClientService.post<any>(url, body, {headers});
    }

    guardarSeccionesPedidos(body): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const urlInt = environment.url + 'purchase-order';
        return this.httpClientService.post<any>(urlInt, body, {headers});
    }

}
