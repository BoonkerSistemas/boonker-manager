import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
    ProyectosPagination,
    ProyectosDtos,
} from 'app/modules/admin/proyectos/proyectos.types';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from '../../../../environments/environment';
@Injectable({
    providedIn: 'root',
})
export class ProyectosService {
    url = environment.url + 'modules';
    private _pagination: BehaviorSubject<ProyectosPagination | null> =
        new BehaviorSubject(null);
    private _product: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<ProyectosDtos[] | null> =
        new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private readonly _httpClient: HttpClient,
        private readonly autenticacionService: AuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for pagination
     */

    /**
     * Getter for product
     */
    get product$(): Observable<any> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<ProyectosDtos[]> {
        return this._products.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get products
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */
    /*getProducts(page: number = 0, size: number = 10, sort: string = 'descripcion', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
        Observable<{ pagination: ProyectosPagination; products: ProyectosDtos[] }> {
        return this._httpClient.get<{ pagination: ProyectosPagination; products: ProyectosDtos[] }>('api/apps/ecommerce/proyectos/products', {
            params: {
                page: '' + page,
                size: '' + size,
                sort,
                order,
                search
            }
        }).pipe(
            tap((response) => {
                console.log('productosssss', response);
                this._pagination.next(response.pagination);
                this._products.next(response.products);
            })
        );
    }*/

    updateProduct(
        id: number,
        product: ProyectosDtos
    ): Observable<ProyectosDtos> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .patch<ProyectosDtos>(
                        'api/apps/ecommerce/proyectos/product',
                        {
                            id,
                            product,
                        }
                    )
                    .pipe(
                        map((updatedProduct) => {
                            // Find the index of the updated product
                            const index = products.findIndex(
                                (item) => item.id === id
                            );

                            // Update the product
                            products[index] = updatedProduct;

                            // Update the products
                            this._products.next(products);

                            // Return the updated product
                            return updatedProduct;
                        }),
                        switchMap((updatedProduct) =>
                            this.product$.pipe(
                                take(1),
                                filter((item) => item && item.id === id),
                                tap(() => {
                                    // Update the product if it's selected
                                    this._product.next(updatedProduct);

                                    // Return the updated product
                                    return updatedProduct;
                                })
                            )
                        )
                    )
            )
        );
    }

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: number): Observable<boolean> {
        return this.products$.pipe(
            take(1),
            switchMap((products) =>
                this._httpClient
                    .delete('api/apps/ecommerce/proyectos/product', {
                        params: { id },
                    })
                    .pipe(
                        map((isDeleted: boolean) => {
                            // Find the index of the deleted product
                            const index = products.findIndex(
                                (item) => item.id === id
                            );

                            // Delete the product
                            products.splice(index, 1);

                            // Update the products
                            this._products.next(products);

                            // Return the deleted status
                            return isDeleted;
                        })
                    )
            )
        );
    }

    create(objeto: any): Observable<any> {
        console.log('guardar', objeto);

        const result = this._httpClient.post<any>(this.url, objeto);

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

    findAll(id: string): Observable<any> {
        console.log(id);
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        return this._httpClient.get<ProyectosDtos[]>(
            environment.url + 'project/' + id,
            {
                headers,
            }
        );
    }

    findOneById(id: number): Observable<ProyectosDtos> {
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const url = this.url + '/' + id;
        const result = this._httpClient.get<any>(url, { headers });

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
                        'No se pudo encontrar el proyecto con id ' + id + '!'
                    );
                }

                return of(proyect);
            })
        );
    }

    updateOneById(objeto: any): Observable<any> {
        console.log(objeto);

        const url = this.url + '/' + objeto.id;
        const headers = new HttpHeaders({
            Authorization: this.autenticacionService.accessToken,
        });
        const result = this._httpClient.put<any>(url, objeto, { headers });
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
}
