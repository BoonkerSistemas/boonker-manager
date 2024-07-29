import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import {
    elementAt,

    map,
    Observable,
    of,

} from 'rxjs';
import { AlertService } from 'app/services/alert.service';
import { MatTableDataSource } from '@angular/material/table';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { DetallesMaterialesService } from '../detalles-materiales.service';
interface Food {
    value: string;
    viewValue: string;
    peso: number;
}
declare let $: any;
import { ActivatedRoute } from '@angular/router';
import { PedidosService } from '../../pedidos/pedidos.service';
import {DespachosDetallesComponent} from "../../despachos/detalles/detalles.component";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
    selector: 'app-detalles-materiales',
    templateUrl: './detalles.component.html',
    styleUrls: ['./detalles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallesMaterialesComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [
        'id',
        'porcentaje',
        'unidades',
        'valor','total',

    ];
    seccion2$: MatTableDataSource<any>;
    displayedColumns2: string[] = [
        'id',
        'descripcion',
        'porcentaje',
        'unidades',
        'valor',
        'total'

    ];
    seccion3$: MatTableDataSource<any>;

    displayedColumns3: string[] = [
        'id',
        'descripcion',
        'porcentaje',
        'unidades',
        'valor',

    ];
    seccion4$: MatTableDataSource<any>;
    pedido$: Observable<any>;
    selected = '';
    dataTabla = [];

    foods: Food[] = [
        { value: '1', viewValue: 'Camioneta', peso: 1000 },
        { value: '2', viewValue: 'Camion', peso: 5000 },
        { value: '3', viewValue: 'Camioncito', peso: 18000 },
        { value: '4', viewValue: 'Mula', peso: 24000 },
        { value: '5', viewValue: 'Trailer', peso: 30000 },
    ];
    idPedido = '';
    dataPedido:any;
    mostrar = false;
    usuarioLogueado: any = [];
    aprobado: any

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { proyect },
        private _detallesMaterialesService: DetallesMaterialesService,
        private _matDialogRef: MatDialogRef<DetallesMaterialesComponent>,
        private readonly alertService: AlertService,
        private readonly activatedRouteService: ActivatedRoute,
        private _pedidosService: PedidosService,
        private _matDialog: MatDialog,
        private _http: HttpClient
    ) {
        this.usuarioLogueado = JSON.parse(localStorage.getItem('user'));
        this.activatedRouteService.params.subscribe(async (parametros) => {
            console.log('PARAMETRO POR RUTA', parametros.id);
            this.idPedido = parametros.id;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Edit
        if (this.idPedido) {
            this._pedidosService
                .findOneByIdPurchaseOrder(this.idPedido)
                .subscribe(
                    (value) => {
                        console.log('pedido', value);
                        this.dataPedido = value;
                        const pedido = {
                            id: this.dataPedido.purchaseOrder[0]._id,
                            cliente: this.dataPedido.purchaseOrder[0].client,
                            codigo: this.dataPedido.purchaseOrder[0].codigo,
                            proyecto: this.dataPedido.purchaseOrder[0].proyecto,
                            ordenDespacho: this.dataPedido.purchaseOrder[0].ordenPedido,
                            modulo: this.dataPedido.purchaseOrder[0].moduloConstruccion,
                            startDate: this.dataPedido.purchaseOrder[0].fechaInicio,
                        };

                        this.pedido$ = of(pedido);
                        let mio = [];

                        value.section[0].detalles.forEach((element) => {

                            mio.push({
                                order: element.order,
                                name: element.descripcion,
                                porcentaje: '',
                                unidades: element.unidades,
                                cantidad: element.cantidad,
                                peso: element.peso,
                                total: element.total,
                                cantidadCosto: 0,
                                unidadesCosto: 0,
                            });
                        });
                        console.log('prueb', mio);

                        this.consultarDataIdDespacho(this.idPedido);


                        this.seccion2$ = new MatTableDataSource(mio);
                        this._changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this.alertService.mensajeError(
                            "Error en el servicio"
                        );
                    }
                );
        }
        // Add
        else {
            // Create an empty pedido
            const pedido = {
                id: null,
                cliente: '',
                codigo: '',
                proyecto: '',
                ordenDespacho: '',
                modulo: '',
                totalP: '',
            };

            this.pedido$ = of(pedido);
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        /*this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();*/
    }


    trackByFn(index: number, item: any): any {
        return item.id || index;
    }





    addNewDespacho(): void {
        const dialogRef = this._matDialog.open(DespachosDetallesComponent, {
            autoFocus: false,
            data: {
                proyect: {},
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log(result);

            const enviar = {
                transporteSeleccionado: result.proyect.transporte.peso,
                dataPedido: this.dataPedido,
            };

            console.log('Enviar', enviar);
            this._detallesMaterialesService.generarDespacho(enviar).subscribe(
                (value) => {
                    console.log('productossss', value);
                    const mio = [];
                    const mio2 = [];
                    value.despachar.forEach((element) => {
                        mio.push({
                            cantidad: element.cantidad,
                            name: element.descripcion,
                            despachado: element.despachado,
                            despachar: element.despachar,
                            estadoPedido: element.estadoPedido,
                            idOp: element.idOp,
                            order: element.order,
                            peso: element.peso,
                            precio: element.precio,
                            sobrante: element.sobrante,
                            total: element.total,
                            unidades: element.unidades,
                            fechaDespacho1:
                                result.proyect.fechaEstimadaDespachos,
                            fechaDespacho2: '',
                        });
                    });

                    value.sobrante.forEach((element) => {
                        mio2.push({
                            cantidad: element.cantidad,
                            name: element.descripcion,
                            despachado: element.despachado,
                            /*despachar: element.despachar,*/
                            estadoPedido: element.estadoPedido,
                            idOp: element.idOp,
                            order: element.order,
                            peso: element.peso,
                            precio: element.precio,
                            sobrante: element.sobrante,
                            total: element.total,
                            unidades: element.unidades,
                        });
                    });
                    console.log('prueb', mio2);

                    this.mostrar = true;

                    this.aprobado = mio

                    this.seccion3$ = new MatTableDataSource(mio);
                    this.seccion4$ = new MatTableDataSource(mio2);
                    this._changeDetectorRef.markForCheck();
                },
                (error) => {
                    this.alertService.mensajeError(
                        "Error"
                    );
                }
            );
        });
    }
    consultarDataIdDespacho(id: any) {
        this._detallesMaterialesService.consultarDespachos(id).subscribe(
            (value) => {
                console.log('despachos', value);
                this._changeDetectorRef.markForCheck();
            },
            (error) => {
                this.alertService.mensajeError(
                  "Error"
                );
            }
        );
    }

    aprobar() {
        let self =  this
        Swal.fire({
            title: "Despacho a Generar?",
            text: "Estas seguro del despacho a seleccionar!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "No",
            confirmButtonText: "Si!"

        }).then(async (result) => {
            if (result.isConfirmed) {
                const url = environment.url + 'send-product';
                   let newOrder = {

                        iva: true,
                        subtotal: true,
                        total: true,
                        dateApproval: new Date(),
                        datePay: new Date(),
                        active: true,
                        commets: "true",
                        purchaseOrder: this.aprobado,
                        module: this.idPedido,
                        status: "Pendiente de aprobación"
                    }

                    return this._http.post<any>(url, newOrder).subscribe(data=>{
                        console.log("asdasdasdasdasdasdasdas")

                })

            }
        });
    }

}
