import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit,} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {map} from 'rxjs';
import {AlertService} from 'app/services/alert.service';
import {SlideService} from "../../../../services/slide/slide.service";

declare let $: any;

@Component({
    selector: 'app-detalles',
    templateUrl: './detalles.component.html',
    styleUrls: ['./detalles.component.scss'],

})
export class PedidosDetallesComponent implements OnInit, OnDestroy {
    pedidoAux: any= [];
    idCliente = '';
    proyecto$: any;
    items: any = [];
    foods: any = [
        { value: 'enSeccion', viewValue: 'En Seccion' },
        { value: 'finSecciones', viewValue: 'Finalizar Secciones' },
    ];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { proyect },
        private _pedidosService: SlideService,
        private _matDialogRef: MatDialogRef<PedidosDetallesComponent>,
        private readonly alertService: AlertService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Edit
        if (this._data.proyect.idPedido) {
            console.log(this._data.proyect.idPedido);

        }
        // Add
        else {
            let fecha = new Date();
            let idProject= localStorage.getItem('project')
            this._pedidosService
                .findOneById(idProject)
                .subscribe(
                    (value:any) => {
                        console.log(value)
                        this.idCliente = value.ruc.name + " " + value.ruc.lastName;
                        //console.log('productossss Detalle Pedido', value.result);
                        //this.proyecto$ = value.result;

                        this.pedidoAux ={
                            id: null,
                            client: value.ruc,
                            codigo:
                                fecha.getFullYear() +
                                '' +
                                (fecha.getMonth() + 1) +
                                '' +
                                fecha.getDate() +
                                '' +
                                fecha.getTime(),
                            proyecto: value.name,
                            moduloConstruccion: 1,
                            codigoCliente: '',
                            ordenPedido: '',
                            revestimiento: '',
                            fechaInicio: value.startDate,
                            secciones: 0,
                            descuento: 0,
                        };
                        console.log("siii", this.pedidoAux)
                        this._changeDetectorRef.markForCheck();
                    },
                    (error) => {
                        this.alertService.mensajeError(
                           error
                        );
                    }
                );
        }

        // Subscribe to pedido updates
        /*this.pedidoChanged
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(500),
                switchMap(pedido => this._pedidosService.updateOneById(pedido)))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });*/
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        /*this._unsubscribeAll.next(null);
         this._unsubscribeAll.complete();*/
    }

    onNoClick(): void {
        this._matDialogRef.close();
    }



    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    updateNoteDetails(pedido: any): void {
        console.log(pedido);

        //  this.pedidoChanged.next(note);
        this._pedidosService
            .updateOneById(pedido)
            .pipe(
                map((llego) => {
                    console.log(llego);
                })
            )
            .subscribe();
    }

    protected readonly Math = Math;

    addFrm(pedido) {
        console.log(pedido);
        this.items = [];
        let cont = 2;
        for (var i = 0; i < pedido.secciones; i++) {
            console.log('ingrese');
            this.items.push({
                titulo: 'SECCION ' + cont,
                denominacion1: 'LINEA MAESTRA 12 MPA CON BISEL',
                factor1: 'ML MAMPOSTERIA',
                medicion1: 'LONGITUD TOTAL DE PAREDES INTERNAS Y EXTERNAS',
                unidad1: 'ml',
                calculo1: 0,
                denominacion2: 'MAMPOSTERIA 12 MPA CON BISEL',
                factor2: 'M2 MAMPOSTERIA',
                medicion2:
                    'AREA TOTAL DE PAREDES INTERNAS Y EXTERNAS, DESCONTANDO PUERTAS Y VENTANAS ',
                unidad2: 'm2',
                calculo2: 0,
                denominacion3: 'DINTELES',
                factor3: 'ML DINTELES',
                medicion3: 'LONGITUD DE VANOS DE PUERTAS Y VENTANAS',
                unidad3: 'ml',
                calculo3: 0,
                detalles: [],
                totalPedido: 0,
                totalPeso: 0,
                showDetalles: false,
            });
            cont = cont + 2;
        }
        console.log(this.items);
    }

    generar(pedido) {
        console.log('POSICION A AGREGAR DATA', this.items);

        this.items.forEach((element, key) => {
            console.log('prueba', key);

            let enviar = [];

            if (
                pedido.revestimiento === 'finSecciones' &&
                this.items.length - 1 === key
            ) {
                console.log('FIN DE SECCION');
                enviar = [
                    {
                        titulo: element.titulo,
                        revestimiento: pedido.revestimiento,
                        numSecciones: pedido.secciones,
                        cuantificacion: [
                            {
                                descripcion: element.denominacion1,
                                calculo: parseFloat(element.calculo1),
                            },
                            {
                                descripcion: element.denominacion2,
                                calculo: parseFloat(element.calculo2),
                            },
                            {
                                descripcion: element.denominacion3,
                                calculo: parseFloat(element.calculo3),
                            },
                        ],
                    },
                ];
            }
            if (
                pedido.revestimiento === 'finSecciones' &&
                this.items.length - 1 !== key
            ) {
                enviar = [
                    {
                        titulo: element.titulo,
                        revestimiento: '',
                        numSecciones: pedido.secciones,
                        cuantificacion: [
                            {
                                descripcion: element.denominacion1,
                                calculo: parseFloat(element.calculo1),
                            },
                            {
                                descripcion: element.denominacion2,
                                calculo: parseFloat(element.calculo2),
                            },
                            {
                                descripcion: element.denominacion3,
                                calculo: parseFloat(element.calculo3),
                            },
                        ],
                    },
                ];
            } else {
                enviar = [
                    {
                        titulo: element.titulo,
                        revestimiento: pedido.revestimiento,
                        numSecciones: pedido.secciones,
                        cuantificacion: [
                            {
                                descripcion: element.denominacion1,
                                calculo: parseFloat(element.calculo1),
                            },
                            {
                                descripcion: element.denominacion2,
                                calculo: parseFloat(element.calculo2),
                            },
                            {
                                descripcion: element.denominacion3,
                                calculo: parseFloat(element.calculo3),
                            },
                        ],
                    },
                ];
            }
            this._pedidosService.generarDetallesMateriales(enviar).subscribe(
                (value) => {
                    console.log('productossss', value);
                    element.detalles = value.pedido;
                    element.totalPedido = value.totalPedido;
                    element.totalPeso = value.pesoTotal;
                    element.showDetalles = true;
                    console.log(element);
                    this._changeDetectorRef.markForCheck();
                },
                (error) => {
                    this.alertService.mensajeError(
                       error
                    );
                }
            );
        });
    }

    guardarSeccion(pedido) {

        this.items.forEach(async (element: any) => {
            const enviar = {
                section: element,
                idProyecto: this.idCliente,
                purchaseOrder: pedido,
                status: "Próximo a Iniciar",
                active: true,
                module: localStorage.getItem('module')
            };
            console.log(enviar)
            this._pedidosService.guardarSeccionesPedidos(enviar).subscribe(
                (value) => {
                    console.log('productossss', value.pedido);
                    this._matDialogRef.close();
                },
                (error) => {
                    this.alertService.mensajeError(
                        error
                    );
                }
            )
        });
        /**/
    }

}
