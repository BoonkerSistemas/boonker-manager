import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/auth/auth.service';
import {UsuarioDto} from "../../dtos/usuario.dto";
import {UpdateResultDto} from "../../dtos/update-result.dto";
import {InsertResultDto} from "../../dtos/insert-result.dto";
import {UserService} from "../user/user.service";

@Injectable({
    providedIn: 'root'
})
export class RolesService {

    private nombreModelo = 'role';

    constructor(
        private readonly httpClientService: HttpClient,
        private readonly autenticacionService: AuthService,
        private readonly userService: UserService
    ) {
    }


    create(objeto: any): Observable<any> {
        console.log(objeto)
        const url = environment.url + this.nombreModelo;
        return this.httpClientService.post<InsertResultDto>(url, objeto);
    }

    findAll(): Observable<any[]> {

        return this.httpClientService.get<UsuarioDto[]>(
            environment.url + this.nombreModelo
        );
    }

    findAllPermisos(): Observable<any[]> {

        return this.httpClientService.get<any[]>(
            environment.url + 'permission'
        );
    }

    /*findOneById(id): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.api_url + this.nombreModelo + "/" + id
        );
    }*/

    async updateOneById(objeto: any) {
        const url = environment.url + this.nombreModelo + "/" + objeto._id;
        this.userService.findAllFull().subscribe(async (data: any) => {
            for (const item of data) {
                console.log("item")
                if (item.rol[0]._id === objeto._id) {
                    console.log("si")
                    let update = {
                        _id: item._id,
                        rol: objeto,
                    }
                    this.userService.updateOneById(update).subscribe(dat => {

                    })
                }
            }
        })
        return this.httpClientService.patch<UpdateResultDto>(url, objeto);
    }

    /*findAllStatus(status): Observable<any[]> {

        return this.httpClientService.get<any>(
            environment.api_url + this.nombreModelo + `/status/${status}`
        );
    }*/
    delete(objeto: any): Observable<any> {
        return this.httpClientService.delete<any>(
            environment.url + this.nombreModelo + `/${objeto._id}`
        );
    }


    /*findLogueado(): Observable<UsuarioDto[]> {
        const url = environment.api_url + '/usuario/logueado/user';
        //const headers = new HttpHeaders({Authorization: this.autenticacionService.sesionDto.accessToken});
        return this.httpClientService.get<UsuarioDto[]>(url, );
    }

    findOneById(id: number | string): Observable<UsuarioDto> {
        const url = environment.api_url + this.nombreModelo + '/id/' + id;

        return this.httpClientService.get<UsuarioDto>(url, );
    }

    findOneByNick(nick: string): Observable<UsuarioDto> {
        const url = environment.api_url + this.nombreModelo + '/' + nick;
        return this.httpClientService.get<UsuarioDto>(url,);
    }



    putEstado(id: number, estado: boolean) {

        return this.httpClientService.put<UpdateResultDto>(environment.api_url + this.nombreModelo + '/' + id, {estado}, );
    }*/


}
