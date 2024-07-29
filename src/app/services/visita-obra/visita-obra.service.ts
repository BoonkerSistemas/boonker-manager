import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class VisitaObraService {
    private nombreModelo = 'webhoook-book/project';

    constructor(
        private readonly httpClientService: HttpClient,
        private readonly autenticacionService: AuthService
    ) {}

    findAll(id): Observable<any[]> {
        return this.httpClientService.get<any[]>(
            environment.url + this.nombreModelo + `/${id}`
        );
    }
}
