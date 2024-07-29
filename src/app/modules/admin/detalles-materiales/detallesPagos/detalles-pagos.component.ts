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
    of, Subject,

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
import {HttpClient, HttpEventType, HttpResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {UploadService} from "../../../../services/upload/upload.service";
import {OrdenPedidoService} from "../../../../services/ordenPedido/ordenPedido.service";

@Component({
    selector: 'app-detalles-pagos',
    templateUrl: './detalles-pagos.component.html',
    styleUrls: ['./detalles-pagos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallesPagosComponent implements OnInit, OnDestroy {
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

    name: string = "";

    progress = 0;
    imageUrlDesktop = "";
    message: any;

    previewMobil = "";
    preview = "";
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    rol: any[];


    crearProgramaFormGroup: FormGroup;

    selectedFiles?: FileList;
    currentFile?: File;
    urlImagen = "";

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _detallesMaterialesService: DetallesMaterialesService,
        private _matDialogRef: MatDialogRef<DetallesPagosComponent>,
        private uploadService: UploadService,
        private readonly alertService: AlertService,
        private readonly activatedRouteService: ActivatedRoute,
        private _pedidosService: PedidosService,
        private _orderPedido: OrdenPedidoService,
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

    onNoClick(): void {
        this._matDialogRef.close();
    }

    selectedFile: File | null = null;

    selectFile(event: any): void {
        this.message = "";
        this.preview = "";
        this.progress = 0;
        this.selectedFiles = event.target.files;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.preview = "";
                this.currentFile = file;

                const reader = new FileReader();

                reader.onload = (e: any) => {
                    this.preview = e.target.result;
                    this.upload();
                };

                reader.readAsDataURL(this.currentFile);
            }
        }
    }


    upload(): void {
        this.progress = 0;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.currentFile = file;

                this.uploadService.upload2(this.currentFile, this.name).subscribe({
                    next: (event: any) => {

                        console.log(event);
                        this.urlImagen = event.body.acl;

                        let value = {
                            _id: this._data.idProject,
                            id: this._data.idProject,
                            comprobante: event.body.acl

                        }
                        this._orderPedido.updateOneById( value).subscribe(value => {
                            this.confirmarPayphone()
                            this.onNoClick()
                            Swal.fire({
                                position: "top-end",
                                icon: "success",
                                title: "Gracias por realizar el pago pronto recibirá un correo de confirmación",
                                showConfirmButton: false,
                                timer: 1500
                            });
                        })

                        if (event.type === HttpEventType.UploadProgress) {
                            this.progress = Math.round((100 * event.loaded) / event.total);
                        } else if (event instanceof HttpResponse) {
                            this.message = event.body.acl;
                            console.log(this.message);
                        }
                    },
                    error: (err: any) => {
                        console.log(err);
                        this.progress = 0;

                        if (err.error && err.error.message) {
                            this.message = err.error.message;
                        } else {
                            this.message = "Could not upload the image!";
                        }

                        this.currentFile = undefined;
                    },
                });
            }

            this.selectedFiles = undefined;
        }
    }

    confirmarPayphone() {
        const valor = localStorage.getItem('valorTotal')
        console.log('moduloooo ', this._data.idProject)
        this._orderPedido.confirmarPago(this.idPedido, this._data.idProject, +valor).subscribe(value => {
            console.log('pagado ', value)
        })
    }

}
