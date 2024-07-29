import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {AuthService} from 'app/core/auth/auth.service';
import {SessionDto} from "../dtos/sesion.dto";

//import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class ColaboradoresService {
    public sesionDto: SessionDto;

    constructor(private readonly http: HttpClient,
                private readonly autenticacionService: AuthService) {
    }

    getColaboradoress() {
        console.log(this.autenticacionService.accessToken);

        const headers = new HttpHeaders({Authorization: this.autenticacionService.accessToken});
        const url: string = `${environment.url}/allUsers`;
        return this.http.get(url, {headers});
    }


    getClientes() {
        console.log(this.autenticacionService.accessToken);

        const headers = new HttpHeaders({Authorization: this.autenticacionService.accessToken});
        const url: string = `${environment.url}/users/cliente`;
        return this.http.get(url, {headers});
    }

    /* getColaboradoress(): Observable<any> {
       return this.http.get<any>('http://20.70.202.236:3015/receta');
   }*/
    getColaborador(id: number | string): Observable<any> {
        const headers = new HttpHeaders({Authorization: this.autenticacionService.accessToken});
        const url: string = `${environment.url}/users/consultarUsuarioId/${id}`;
        return this.http.get<any>(url, {headers});
    }
    updateColaborador(id: number | string): Observable<any> {
        const headers = new HttpHeaders({Authorization: this.autenticacionService.accessToken});
        const url: string = `${environment.url}/users/consultarUsuarioId/${id}`;
        return this.http.get<any>(url, {headers});
    }
}
