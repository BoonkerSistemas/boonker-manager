import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioDto } from '../../dtos/usuario.dto';
import { UpdateResultDto } from '../../dtos/update-result.dto';
import { InsertResultDto } from '../../dtos/insert-result.dto';

@Injectable({
    providedIn: 'root',
})
export class OrdenPedidoService {
    private nombreModelo = 'order-product';
    private nombreModeloDespacho = 'generate-dispach';
    private modeloPayphone = 'payphone'
    private modeloConfimacion = 'generate-dispach/pagocliente/'
    private nombreModeloValidarFinanzas = 'generate-dispach/finanzas'

    constructor(
        private readonly httpClientService: HttpClient,
        private readonly autenticacionService: AuthService,
        private httpClient: HttpClient
    ) {}

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
            environment.url + this.nombreModelo + '/project/' + id
        );
    }

    findOneDocument(id, type): Observable<any[]> {
        return this.httpClientService.get<any>(
            environment.url +
                this.nombreModelo +
                '/documentproject/' +
                id +
                '/' +
                type
        );
    }

    findOnePersonal(id, type): Observable<any[]> {
        return this.httpClientService.get<any>(
            environment.url + this.nombreModelo + '/user/' + id
        );
    }

    updateOneById(objeto: any): Observable<UpdateResultDto> {
        const url = environment.url + this.nombreModeloDespacho + '/' + objeto._id;

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
        const url =
            'https://1s4s9m33pj.execute-api.us-east-1.amazonaws.com/dev/ordenpedido/generar';
        return this.httpClientService.post<any>(url, body, { headers });
    }

    guardarSeccionesPedidos(body): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const urlInt = environment.url + 'purchase-order';
        return this.httpClientService.post<any>(urlInt, body, { headers });
    }

    generateDespacho(idModule): Observable<any[]> {
        return this.httpClientService.get<any>(
            environment.url + this.nombreModeloDespacho + `/${idModule}`
        );
    }

    newDespacho(idProyect, idModulo, pesoTransporte): Observable<any[]> {
        console.log('new despacho ', environment.url + this.nombreModeloDespacho + `/${idProyect}` + `/${pesoTransporte}`)
        return this.httpClientService.get<any>(
            environment.url + this.nombreModeloDespacho + `/${idProyect}`+ `/${idModulo}` + `/${pesoTransporte}`
        );
    }

    servicioPayphone(parametros: any): Observable<any> {
        console.log('parametros ', environment.tokenPayphone)
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${environment.tokenPayphone}`,
            'Content-Type': "application/json"
        })
        const url = environment.url + this.modeloPayphone
        return this.httpClient.post<any>(url, parametros, {headers})
    }

    confirmarPago(idModulo, idProyect, total) {
        console.log('confirmar pago ', idModulo+' '+idProyect)
        return this.httpClientService.post<any>(
            environment.url + this.modeloConfimacion + `/${idModulo}`+ `/${idProyect}`+`/${total}`,{}
        )
    }

    verificarValores(idModulo) {
        console.log('finanzas ',idModulo)
        return this.httpClientService.get<any>(
            environment.url + this.nombreModeloValidarFinanzas + `/${idModulo}`
        )
    }
}
