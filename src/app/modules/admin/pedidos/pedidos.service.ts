import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';
import {
    PedidosPagination,
    PedidosDtos,
} from 'app/modules/admin/pedidos/pedidos.types';
import {AuthService} from 'app/core/auth/auth.service';
import {environment} from '../../../../environments/environment';
import {data} from "autoprefixer";

@Injectable({
    providedIn: 'root',
})
export class PedidosService {
    // Private
    private _pagination: BehaviorSubject<PedidosPagination | null> =
        new BehaviorSubject(null);
    private _product: BehaviorSubject<any | null> = new BehaviorSubject(null);
    url = environment.url + 'purchase-order';

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient,
        private readonly autenticacionService: AuthService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for product
     */
    get product$(): Observable<any> {
        return this._product.asObservable();
    }


    create(objeto: any): Observable<any> {
        console.log('guardar', objeto);


        const result = this._httpClient.post<any>(this.url, objeto);

        return result.pipe(
            take(1),
            map((proyect) => {
                console.log(proyect);
                this._product.next(proyect.result);
                return proyect;
            })
        );
    }

    findAll(): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        return this._httpClient.get<PedidosDtos[]>(environment.url, {
            headers,
        });
    }

    findOneById(id: number): Observable<PedidosDtos> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = environment.url + '/' + id;
        const result = this._httpClient.get<any>(url, {headers});

        return result.pipe(
            take(1),
            map((proyect) => {
                // Update the note
                this._product.next(proyect.result);

                // Return the note
                return proyect.result;
            }),
            switchMap((proyect) => {
                if (!proyect) {
                    return throwError(
                        'No se pudo encontrar el pedido con id ' + id + '!'
                    );
                }

                return of(proyect);
            })
        );
    }

    updateOneById(objeto: any): Observable<any> {
        console.log(objeto);

        const url = environment.url + '/' + objeto.id;
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const result = this._httpClient.put<any>(url, objeto, {headers});
        //return null;
        return result.pipe(
            take(1),
            map((proyect) => {
                console.log(proyect);

                // Update the products with the new product
                //this._products.next([proyect, ...this._products]);
                this._product.next(proyect.result);
                // Return the new product
                return proyect;
            })
        );
    }

    /*PROYECTO */
    findOneByIdProyecto(id: number): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = environment.url + '/' + id;
        return this._httpClient.get<any>(url, {headers});
    }

    generarDetallesMateriles(body): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = environment.url + '/generar';
        return this._httpClient.post<any>(url, body, {headers});
    }

    guardarSeccionesPedidos(body): Observable<any> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = environment.url;
        return this._httpClient.post<any>(url, body, {headers});
    }

    findOneByIdPurchaseOrder(id): Observable<any> {
        const url = environment.url + 'purchase-order/' + id;
        return this._httpClient.get<any>(url);
    }

    generatePurchase(order, id): Observable<any> {

        return

    }

}
