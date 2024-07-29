import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpRequest} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/auth/auth.service';
import {UsuarioDto} from "../../dtos/usuario.dto";
import {UpdateResultDto} from "../../dtos/update-result.dto";
import {InsertResultDto} from "../../dtos/insert-result.dto";

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private nombreModelo = 'media';

    constructor(
        private readonly httpClientService: HttpClient,
        private http: HttpClient,
        private readonly autenticacionService: AuthService
    ) {
    }

    create(objeto: any): Observable<any> {
        const url = environment.urlFile + this.nombreModelo;
        return this.httpClientService.post<InsertResultDto>(url, objeto);
    }

    findAll(): Observable<any[]> {

        return this.httpClientService.get<UsuarioDto[]>(environment.urlFile + this.nombreModelo,);
    }

    upload(file: File, type): Observable<HttpEvent<any>> {


        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${environment.urlFile}${this.nombreModelo}`, formData, {
            reportProgress: true,
            responseType: 'json',
        });

        return this.http.request(req);
    }

    upload2(file: File, type): Observable<HttpEvent<any>> {


        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${environment.urlFile}${this.nombreModelo}/media`, formData, {
            reportProgress: true,
            responseType: 'json',
        });

        return this.http.request(req);
    }


    updateOneById(objeto: any): Observable<UpdateResultDto> {
        const url = environment.urlFile + this.nombreModelo + '/' + objeto._id;

        return this.httpClientService.patch<UpdateResultDto>(url, objeto,);
    }


    delete(objeto: any): Observable<any> {
        return this.httpClientService
            .delete<any>(environment.urlFile + this.nombreModelo + `/${objeto._id}`);
    }
}

