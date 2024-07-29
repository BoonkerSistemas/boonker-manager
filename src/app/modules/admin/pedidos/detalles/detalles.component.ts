import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map, Observable, of } from 'rxjs';
import { PedidosService } from '../pedidos.service';
import { AlertService } from 'app/services/alert.service';

declare let $: any;

@Component({
    selector: 'app-detalles',
    templateUrl: './detalles.component.html',
    styleUrls: ['./detalles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class PedidosDetallesComponent implements OnInit, OnDestroy {
    pedido$: Observable<any>;
    idCliente = '';
    proyecto$: any;
    items: any = [];
    /*items: any = [{
        titulo : 'SECCION 2',
        denominacion1: 'LINEA MAESTRA 12 MPA CON BISEL',
                factor1: 'ML MAMPOSTERIA',
                medicion1: 'LONGITUD TOTAL DE PAREDES INTERNAS Y EXTERNAS',
                unidad1: 'ml',
                calculo1: 0,
        denominacion2: 'MAMPOSTERIA 12 MPA CON BISEL',
                factor2: 'M2 MAMPOSTERIA',
                medicion2: 'AREA TOTAL DE PAREDES INTERNAS Y EXTERNAS, DESCONTANDO PUERTAS Y VENTANAS',
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
        showDetalles: false
}];*/
    foods: any = [
        { value: 'enSeccion', viewValue: 'En Seccion' },
        /*{ value: 'entreSeccion', viewValue: 'Entre Secciones' },*/
        { value: 'finSecciones', viewValue: 'Finalizar Secciones' },
    ];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { proyect },
        private _pedidosService: PedidosService,
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

            // Request the data from the server
            this._pedidosService
                .findOneById(this._data.proyect.idCliente)
                .subscribe();
            // Get the pedido
            this.pedido$ = this._pedidosService.product$;
        }
        // Add
        else {
            let fecha = new Date();
            console.log(this._data.proyect);
            this._pedidosService
                .findOneByIdProyecto(this._data.proyect.idCliente)
                .subscribe(
                    (value) => {
                        this.idCliente = this._data.proyect.idCliente;
                        console.log('productossss Detalle Pedido', value.result);
                        this.proyecto$ = value.result;

                        const pedido = {
                            id: null,
                            client: this.proyecto$.cliente,
                            codigo:
                                fecha.getFullYear() +
                                '' +
                                (fecha.getMonth() + 1) +
                                '' +
                                fecha.getDate() +
                                '' +
                                fecha.getTime(),
                            proyecto: this.proyecto$.project,
                            moduloConstruccion: 1,
                            codigoCliente: '',
                            ordenPedido: '',
                            revestimiento: '',
                            fechaInicio: this.proyecto$.date,
                            secciones: 0,
                            descuento: this.proyecto$.descuento,
                        };

                        this.pedido$ = of(pedido);
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

    /**
     * Create a new note
     *
     * @param pedido
     */
    createNote(pedido: any): void {
        console.log(pedido);
        //localStorage.setItem("opc", JSON.stringify(pedido));

        /*const enviar = {
          client : pedido.client,
      construction : pedido.construction,
      costBoonker : pedido.costBoonker,
      costClose : pedido.costClose,
      date : pedido.date,
      fileTemporal : pedido.fileTemporal,
      lastContact : pedido.lastContact,
      listedArea : pedido.listedArea,
      location : pedido.location,
      nextDate: pedido.nextDate,
      nextStep: pedido.nextStep,
      observation: pedido.observation,
      percentClose: pedido.percentClose,
      project: pedido.project,
      state: pedido.state,
      userResponsible: pedido.userResponsible
        }

          this._pedidosService.create(enviar).pipe(
              map((llego) => {
                  console.log(llego);
                  if(llego.message === 'Pedido Creado con éxito'){
       // Get the pedido
       pedido.id = llego.id
       this.pedido$ = pedido;
       console.log(this.pedido$);
       this._matDialogRef.close();
       this.alertService.mensajeSuccess('Pedido Creado con éxito')
                  }
                 else{
                  this.alertService.mensajeInfo('Vuelva a intentarlo mas tarde.')
                 }

              })).subscribe();*/
        this._matDialogRef.close();
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
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
                    /* if(llego.message === 'Pedido Creado con éxito'){
      // Get the pedido
      pedido.id = llego.id
      this.pedido$ = pedido;
      console.log(this.pedido$);
      this._matDialogRef.close();
      this.alertService.mensajeSuccess('Pedido Creado con éxito')
                 }
                else{
                 this.alertService.mensajeInfo('Vuelva a intentarlo mas tarde.')
                }*/
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
            this._pedidosService.generarDetallesMateriles(enviar).subscribe(
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
        console.log(
            'SECCION',
            this.items,
            'PEDIDO',
            pedido,
            'ID PROYECTO',
            this.proyecto$.id
        );
        this.items.forEach((element) => {
            const enviar = {
                seccion: element,
                idProyecto: this.idCliente,
                detallesPedido: pedido,
            };
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
            );
        });
        /**/
    }
}
