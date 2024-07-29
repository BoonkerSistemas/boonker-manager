import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { DespachosPagination, DespachosDtos } from 'app/modules/admin/despachos/despachos.types';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from '../../../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class DespachosService {
    // Private
    private _pagination: BehaviorSubject<DespachosPagination | null> = new BehaviorSubject(null);
    private _product: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<DespachosDtos[] | null> = new BehaviorSubject(null);


    /**
     * Constructor
     */
    constructor(private readonly _httpClient: HttpClient,
        private readonly autenticacionService: AuthService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------


    /**
     * Getter for pagination
     */
    get pagination$(): Observable<DespachosPagination> {
        return this._pagination.asObservable();
    }

    /**
     * Getter for product
     */
    get product$(): Observable<any> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<DespachosDtos[]> {
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
        Observable<{ pagination: DespachosPagination; products: DespachosDtos[] }> {
        return this._httpClient.get<{ pagination: DespachosPagination; products: DespachosDtos[] }>('api/apps/ecommerce/despachos/products', {
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
    /**
     * Get product by id
     */
    getProductById(id: number): Observable<DespachosDtos> {
        return this._products.pipe(
            take(1),
            map((products) => {

                // Find the product
                const product = products.find(item => item.id === id) || null;

                // Update the product
                this._product.next(product);

                // Return the product
                return product;
            }),
            switchMap((product) => {

                if (!product) {
                    return throwError('Could not found product with id of ' + id + '!');
                }

                return of(product);
            })
        );
    }

    /**
     * Create product
     */
    createProduct(): Observable<DespachosDtos> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.post<DespachosDtos>('api/apps/ecommerce/despachos/product', {}).pipe(
                map((newProduct) => {
                    console.log(newProduct);

                    // Update the products with the new product
                    this._products.next([newProduct, ...products]);

                    // Return the new product
                    return newProduct;
                })
            ))
        );
    }

    /**
     * Update product
     *
     * @param id
     * @param product
     */
    updateProduct(id: number, product: DespachosDtos): Observable<DespachosDtos> {
        return this.products$.pipe(
            take(1),
            switchMap(products => this._httpClient.patch<DespachosDtos>('api/apps/ecommerce/despachos/product', {
                id,
                product
            }).pipe(
                map((updatedProduct) => {

                    // Find the index of the updated product
                    const index = products.findIndex(item => item.id === id);

                    // Update the product
                    products[index] = updatedProduct;

                    // Update the products
                    this._products.next(products);

                    // Return the updated product
                    return updatedProduct;
                }),
                switchMap(updatedProduct => this.product$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the product if it's selected
                        this._product.next(updatedProduct);

                        // Return the updated product
                        return updatedProduct;
                    })
                ))
            ))
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
            switchMap(products => this._httpClient.delete('api/apps/ecommerce/despachos/product', { params: { id } }).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted product
                    const index = products.findIndex(item => item.id === id);

                    // Delete the product
                    products.splice(index, 1);

                    // Update the products
                    this._products.next(products);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }



    /**
     * Update the avatar of the given contact
     *
     * @param id
     * @param avatar
     */
    /*uploadAvatar(id: string, avatar: File): Observable<Contact>
    {
        return this.contacts$.pipe(
            take(1),
            switchMap(contacts => this._httpClient.post<Contact>('api/apps/contacts/avatar', {
                id,
                avatar
            }, {
                headers: {
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedContact) => {

                    // Find the index of the updated contact
                    const index = contacts.findIndex(item => item.id === id);

                    // Update the contact
                    contacts[index] = updatedContact;

                    // Update the contacts
                    this._contacts.next(contacts);

                    // Return the updated contact
                    return updatedContact;
                }),
                switchMap(updatedContact => this.contact$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the contact if it's selected
                        this._contact.next(updatedContact);

                        // Return the updated contact
                        return updatedContact;
                    })
                ))
            ))
        );
    }*/



    create(objeto: any): Observable<any> {
        console.log('guardar', objeto);
        //const headers = new HttpHeaders({ Authorization: this.autenticacionService.accessToken });
        const url = environment.url ;
        const result = this._httpClient.post<any>(url, objeto);

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
        )
    }

    findAll(): Observable<any> {
        const headers = new HttpHeaders({ Authorization: this.autenticacionService.accessToken });
        return this._httpClient.get<DespachosDtos[]>(environment.url , { headers });
    }

    findOneById(id: number): Observable<DespachosDtos> {
        const headers = new HttpHeaders({ Authorization: this.autenticacionService.accessToken });
        const url = environment.url + '/' + id;
        const result = this._httpClient
            .get<any>(url, { headers });

            return result.pipe(
                take(1),
                map((proyect) => {
                    // Update the note
                    this._product.next(proyect.result);

                    // Return the note
                    return proyect.result;
                }),
                switchMap((proyect) => {

                    if ( !proyect )
                    {
                        return throwError('No se pudo encontrar el pedido con id ' + id + '!');
                    }

                    return of(proyect);
                })
            );



    }

    updateOneById(objeto: any): Observable<any> {
        console.log(objeto);

        const url = 'https://ggtexqpal5.execute-api.us-east-1.amazonaws.com/dev/project/' + objeto.id;

        const headers = new HttpHeaders({ Authorization: this.autenticacionService.accessToken });
        const result =  this._httpClient.put<any>(url, objeto, { headers });
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
            )
    }
}
