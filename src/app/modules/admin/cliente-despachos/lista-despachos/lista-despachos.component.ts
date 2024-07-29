import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Observable, Subject, map, tap} from 'rxjs';
import {fuseAnimations} from '@fuse/animations';
import {ProyectosDtos} from 'app/modules/admin/proyectos/proyectos.types';
import {ProyectosService} from 'app/modules/admin/proyectos/proyectos.service';
import {MatTableDataSource} from '@angular/material/table';
import {AlertService} from 'app/services/alert.service';

import {MatDialog} from '@angular/material/dialog';

import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {SlideService} from '../../../../services/slide/slide.service';
import {ModuleService} from '../../../../services/module/module.service';
import {OrdenPedidoService} from '../../../../services/ordenPedido/ordenPedido.service';
import {DespachosDetallesComponent} from '../../despachos/detalles/detalles.component';
import {DespachosDetallesClienteComponent} from '../detalles/detalles.component';
import {values} from 'lodash';
import axios from 'axios'
import {environment} from "../../../../../environments/environment";
import {DetallesPagosComponent} from "../../detalles-materiales/detallesPagos/detalles-pagos.component";

//const axios = require('axios');

@Component({
    selector: 'app-lista-despachos',
    templateUrl: './lista-despachos.component.html',
    styleUrls: ['./lista-despachos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListaDespachosComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private paginator: MatPaginator;
    proyectosDtos: any = [];
    proyectos$: MatTableDataSource<any>;
    proyectosOp$: MatTableDataSource<any>;
    isLoading: boolean = false;

    pedido: any;

    nameProject = '';
    selectedProyectos: ProyectosDtos | null = null;
    selectedProyectosForm: FormGroup;
    displayedColumns: string[] = [
        'detalle',
        'unidad',
        'cantidad',
        'precio',
        'total',
    ];
    displayedColumnsDinamico: string[] = [
        'detalle',
        'unidad',
        'cantidad',

        'precio',
        'total',
    ];
    columnsToDisplay: string[] = this.displayedColumnsDinamico.slice();

    displayedColumns1: string[] = [
        'pedido',
        'modulo',
        'estatus',
        'despachado',
        'porDespachar',
        'guia',
        'accion',
    ];

    actualizar = false;
    usuario: any = [];
    id: string;
    cliente: any;
    usuarioLogueado: any = [];

    project = '';
    client: any = [];

    module: any = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    fecha: string;

    title = '';
    dataTabla: any = [];
    dataTablaGuias: any = [];
    ultimaguia: any = [];

    //
    idProyecto = ''
    idModulo = ''
    idProyecto2 = ''
    idModulo2 = ''
    verificacion: boolean = false
    valor = 0
    estadoBoton = ''
    idPago = ''

    keyword = 'module';
    rol: any[];
    tipo: any = [];
    mostrarTabla = false;
    totalValor = 0

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _inventoryService: ProyectosService,
        private readonly alertService: AlertService,
        private _matDialog: MatDialog,
        private _project: SlideService,
        private _orderPedido: OrdenPedidoService,
        private _module: ModuleService,
        private route: ActivatedRoute,
        private _activatedRoute: ActivatedRoute,
        private routerService: Router
    ) {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.project = params.get('id');
            console.log('proyecto => ', this.project)
            this.idProyecto = this.project
            localStorage.setItem('project', this.project);
            this.consultarCliente();
            this.consultarProductos();
            this.consultarOrdenPedido();
        });
    }

    addColumn() {
        this.displayedColumnsDinamico.push('GUIA #3047');
        this.columnsToDisplay.push('GUIA #3047');
        this.displayedColumnsDinamico.push('GUIA #3060');
        this.columnsToDisplay.push('GUIA #3060');
        this.displayedColumnsDinamico.push('GUIA #3072');
        this.columnsToDisplay.push('GUIA #3072');
        this.displayedColumnsDinamico.push('Total Despachado');
        this.columnsToDisplay.push('Total Despachado');
        this.displayedColumnsDinamico.push('Por Despachar');
        this.columnsToDisplay.push('Por Despachar');
    }

    async ngOnInit(): Promise<void> {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');

            console.log(params.get('id'));
        });

        this.selectedProyectosForm = this._formBuilder.group({
            id: [''],
            estado: [false],
            descripcion: ['', [Validators.required]],
            ncm: ['', [Validators.required]],
            peso: ['', [Validators.required]],
            tipo: ['', [Validators.required]],
            origen: ['', [Validators.required]],
            fispq: [false],
            temperatura: ['', [Validators.required]],
        });
    }

    async consultarCliente() {
        try {
            let roles = [];
            this._project.findOneById(this.project).subscribe((data) => {
                this.client = data;
                console.log('cliente => ', this.client);
                this.client.module.forEach((item) => {
                    item.module = 'Modulo ' + item.module;
                    roles.push(item);
                });
                this.rol = roles;
                console.log('ROLESSSSS', this.rol);
                this._changeDetectorRef.markForCheck();
                //this.nameProject = this.client
            });
            console.log(this.client);
        } catch (e) {
            console.log(e);
        }
    }

    consultarOrdenPedido() {
        try {
            this._orderPedido
                .findOneById(this.project)
                .subscribe((data: any) => {
                    console.log('productos despachos => ', data);
                    let data1 = data.detalle;
                    this.dataTabla = data.detalle;
                    this.pedido = data;
                    //this.proyectosOp$ = new MatTableDataSource(data1);
                    //this.proyectosOp$.paginator = this.paginator;
                    this._changeDetectorRef.markForCheck();

                    if (this.proyectosDtos.length < 1) {
                        this.alertService.mensajeInfo(
                            'No existen productos registrados'
                        );
                    }
                    this.isLoading = false;
                });
        } catch (e) {
            console.log(e);
        }
    }

    consultarModule(id) {
        console.log('module', id);
        try {
            this._module.findOneById(id).subscribe((data) => {
                this.module = data;
            });
        } catch (e) {
            console.log(e);
        }
    }

    estatusDespacho() {
        this._orderPedido.generateDespacho(this.idModulo2).subscribe((value: any) => {
            this.estadoBoton = value[value.length - 1].status
            this.idPago = value[value.length - 1]._id
            console.log('esstadoo ', this.idPago)
            this._changeDetectorRef.detectChanges()
        })
    }

    // subirArchivo() {
    //     const dialogRef = this._matDialog.open(DespachosDetallesClienteComponent,
    //         {
    //             carga: 'carga de archivos'
    //         }
    //     );
    //     dialogRef.afterClosed().subscribe(value => {
    //         console.log(value)
    //     })
    // }

    consultarGuias(idModule) {
        console.log('idmodulo => ', idModule)
        this._orderPedido.generateDespacho(idModule).subscribe((value) => {
            console.log('Guias', value);
            this.mostrarTabla = true;
            this.ultimaguia = [value[value.length - 1]];

            console.log(value.length - 1);
            console.log('datos tabla => ', this.ultimaguia);
            this.dataTablaGuias = value;
            //this.title = value.name;
            this._changeDetectorRef.markForCheck();
            return value
        });
    }


    async consultarProductos() {
        this.isLoading = true;
        await this.consultarCliente();
        let data: any = [];
        const responseData = [
            {
                idProject: '65d4b385dfe97d7e541ba81d',
                send: '1',
                module: '1',
                estado: 'Entregado',
                despachado: {
                    m2: 20,
                    detalle: [
                        {
                            cantidad: 3,
                            name: 'MAMPUESTO ESTRUCTURAL BKR 12 MPA CON BISEL MAESTRA',
                            despachado: 0,
                            despachar: 24900,
                            estadoPedido: true,
                            order: 1,
                            peso: 5100,
                            precio: 323.76,
                            sobrante: 0,
                            total: 971.28,
                            unidades: 'PALLETS 144 UNIDADES',
                            fechaDespacho2: '',
                        },
                        {
                            cantidad: 45,
                            name: 'GROUT DE NIVELACIÓN MAESTRA',
                            despachado: 0,
                            estadoPedido: true,
                            order: 1,
                            peso: 75,
                            precio: 10.41,
                            sobrante: 24975,
                            total: 31.23,
                            unidades: 'Saco 25KG',
                            fechaDespacho2: '',
                        },
                    ],
                },
                valorDespachado: '1230.51',
                porDespachar: [
                    {
                        cantidad: 28,
                        name: 'MAMPUESTO ESTRUCTURAL BKN 12 CON BISEL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 320,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 12,
                        name: 'DINTEL CONCRETO ARMADO',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 14,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 31,
                        name: 'MORTERO SELLADOR DE MUROS- BOONKER SEAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                saldo: '14542.44',
            },
            {
                idProject: '65d4b385dfe97d7e541ba81d',
                send: '2',
                module: '1',
                estado: 'Entregado',
                despachado: [
                    {
                        cantidad: 10,
                        name: 'MAMPUESTO ESTRUCTURAL BKR 12 MPA CON BISEL',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 120,
                        name: 'GROUT ESTRUCTURAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                valorDespachado: '1230.51',
                porDespachar: [
                    {
                        cantidad: 18,
                        name: 'MAMPUESTO ESTRUCTURAL BKN 12 CON BISEL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 200,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 12,
                        name: 'DINTEL CONCRETO ARMADO',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 14,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 31,
                        name: 'MORTERO SELLADOR DE MUROS- BOONKER SEAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                saldo: '9930.44',
            },
            {
                idProject: '65d4b385dfe97d7e541ba81d',
                send: '3',
                module: '1',
                estado: 'Entregado',
                despachado: [
                    {
                        cantidad: 8,
                        name: 'MAMPUESTO ESTRUCTURAL BKR 12 MPA CON BISEL',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 120,
                        name: 'GROUT ESTRUCTURAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 12,
                        name: 'DINTEL CONCRETO ARMADO',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                valorDespachado: '1230.51',
                porDespachar: [
                    {
                        cantidad: 10,
                        name: 'MAMPUESTO ESTRUCTURAL BKN 12 CON BISEL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 80,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 14,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 31,
                        name: 'MORTERO SELLADOR DE MUROS- BOONKER SEAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                saldo: '4630.70',
            },
            {
                idProject: '65d4b385dfe97d7e541ba81d',
                send: '4',
                module: '1',
                estado: 'Entregado',
                despachado: [
                    {
                        cantidad: 10,
                        name: 'MAMPUESTO ESTRUCTURAL BKR 12 MPA CON BISEL',
                        despachado: 0,
                        despachar: 24900,
                        estadoPedido: true,
                        order: 1,
                        peso: 5100,
                        precio: 323.76,
                        sobrante: 0,
                        total: 971.28,
                        unidades: 'PALLETS 144 UNIDADES',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 80,
                        name: 'GROUT ESTRUCTURAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 14,
                        name: 'GROUT ESTRUCTURAL ESTANDAR',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                    {
                        cantidad: 31,
                        name: 'MORTERO SELLADOR DE MUROS- BOONKER SEAL',
                        despachado: 0,
                        estadoPedido: true,
                        order: 1,
                        peso: 75,
                        precio: 10.41,
                        sobrante: 24975,
                        total: 31.23,
                        unidades: 'Saco 25KG',
                        fechaDespacho2: '',
                    },
                ],
                valorDespachado: '1230.51',
                porDespachar: [],
                saldo: '0.00',
            },
        ];

        let respuesta = responseData.filter(
            (ubicacion) => ubicacion.idProject === this.project
        );

        this.proyectosDtos = respuesta;
        this.proyectos$ = new MatTableDataSource(this.proyectosDtos);

        console.log(this.proyectos$);

        this.proyectos$.paginator = this.paginator;
        this._changeDetectorRef.markForCheck();

        if (this.proyectosDtos.length < 1) {
            await this.alertService.mensajeInfo(
                'No existen productos registrados'
            );
        }
        this.isLoading = false;
        console.log('RESPUESTAAA', respuesta);
        return this.proyectosDtos;

        /*this._inventoryService
            .findAll(this.project)
            .subscribe(async (value) => {
                console.log(value);

                this.proyectosDtos = value;
                this.proyectos$ = new MatTableDataSource(
                    this.proyectosDtos.module
                );


                console.log(this.proyectos$)


                this.proyectos$.paginator = this.paginator;
                this._changeDetectorRef.markForCheck();

                if (this.proyectosDtos.length < 1) {
                    await this.alertService.mensajeInfo(
                        'No existen productos registrados'
                    );
                }
                this.isLoading = false;
                return this.proyectosDtos;
            });*/
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    applyFilter(event: Event): void {
        this.isLoading = true;
        const filterValue = (event.target as HTMLInputElement).value;
        this.proyectos$.filter = filterValue.trim().toLowerCase();
        if (this.proyectos$.paginator) {
            this.proyectos$.paginator.firstPage();
            this.isLoading = false;
        }
        this.isLoading = false;
    }

    ngAfterViewInit(): void {
        this.consultarProductos();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    OpenDashboard(data) {
        console.log('DATTTAAA', data);
        this.routerService.navigateByUrl(
            '/cliente-despachos/dashboard/' + data._id
        );
    }

    openDocument() {
        this.routerService.navigateByUrl(
            '/detallesMateriales/65fb5b30e1f4a001b83f5ac7'
        );
    }

    cambiosGuias(): Observable<number> {
        return this._orderPedido.generateDespacho(this.idModulo2).pipe(
            map((value) => value.length),
            tap((numero) => {
                console.log('cuantas guias hay ', numero)
            })
        );
    }

    generarPrimerDespacho() {
        this.cambiosGuias().subscribe((valor) => {
            this.valor = valor - 1
            console.log('numero guiasss ', this.valor)
            if (this.valor < 0) {
                this._orderPedido.newDespacho(this.idProyecto2, this.idModulo2, 1000).subscribe((value: any) => {
                    console.log('primer despacho ', value.s.enviar.length === 0)
                    this.verificacion = true
                })
            }
        })
    }

    generarNewDespacho(): void {
        const dialogRef = this._matDialog.open(DespachosDetallesClienteComponent,
            {
                autoFocus: false,
                data: {
                    proyect: {},
                    idProyect: this.project,
                },
            }
        );
        //this.generarPrimerDespacho()
        dialogRef.afterClosed().subscribe((result) => {
            console.log('datos para despacho => ', result);
            console.log('idProyecto ', result.idProyect)
            console.log('idModulo ', result.proyect.module._id)
            this.idProyecto = result.idProyect
            this.idModulo = result.proyect.module._id
            this.consultarGuias(result.proyect.module._id);
            //this.generarPrimerDespacho(result.idProyect, result.proyect.module._id)
            // console.log('Enviar', enviar);
            //http://54.81.235.72:3000/api/v1/generate-dispach/660f664ad701b55fa213b1cc/1000
            this._orderPedido.newDespacho(result.idProyect, result.proyect.module._id, result.proyect.transporte.peso).subscribe({
                next: (value) => {
                    console.log('DESPACHOOOOOOO', value);
                    this.estatusDespacho()
                    this.consultarGuias(result.proyect.module._id);

                    this._changeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.alertService.mensajeError(error.message);
                }
            });
        });
    }

    openDespachos() {
        this.routerService.navigateByUrl(
            '/cliente-despachos/lista-despachos/' + this.project
        );
    }

    descargaOp(data) {
        console.log('DATTTAAA', data);
        this.routerService.navigateByUrl(
            '/cliente-despachos/dashboard/' + data._id
        );
    }

    selectEvent(item: any) {
        console.log('ITEM para despachos', item);
        this.idProyecto2 = item.project
        this.idModulo2 = item._id
        console.log('ids ', item.project + ' ' + item._id)
        this.generarPrimerDespacho()
        this.tipo = item ? item : '';
        this.consultarGuias(item._id);
        this.estatusDespacho()
        item.deselect();
        this._changeDetectorRef.detectChanges()
    }

    onChangeSearch(val: string) {
        // console.log(val);
    }

    onFocused(e) {
        // console.log(e);
    }

    validarFinanzas() {
        this._orderPedido.verificarValores(this.idPago).subscribe(value => {
            console.log('finanzas notificacion ', value)
        })
    }

    confirmarPago(total) {
        console.log('guiaPago ', this.idPago)
        console.log('idProyecto', this.idProyecto2)
        console.log('pago ', total)
        this._orderPedido.confirmarPago(this.idPago, this.idProyecto2, total).subscribe(value => {
            console.log('pagado ', value)
        })
    }

    pagar(recibi) {
        console.log('PAGAR', recibi[0].enviado);
        const amount = recibi[0].enviado.reduce((total, value) => total + value.total, 0).toFixed(2)
        console.log('total ', typeof amount)

        const iva = amount * 0.15
        const total = (+(((+amount) + iva).toFixed(1))) * 100
        this.totalValor = total
        console.log('total ', total)
        this.confirmarPago(this.totalValor)

        let data = JSON.stringify({
        "responseUrl": "https://boonkerdigital.com:4200/#/sign-in?redirectURL=%2Facademy",
        "amount": total,
        "amountWithoutTax": total,
        });

        let config: any = {
            method: 'post',
            maxBodyLength: Infinity,
            url: environment.url + '/payphone',
            headers: {
                'Authorization': 'Bearer e3KCtqwjcchjTx0OdIFKiwGCH9bEIpUnQfp8kvlD6vqeABD7x0jr9U31ktAJlc0_hMPExAm8yFjLHIenROq0vECP798oipnCI10lPu_h6H4W_hDTmWmqqG1CjHvnG0JWtvXWwF58Js9fmIU3jrufF1-PsLeAl16Twj2vHGRhEVziQr_f8duktzQxIpSv7kzNaYRRTX0utJ_RzCduAh3KKScD8n9ncI16Y5nqjZOQonIaMs0NqgbvGuFBxT3Rlx2AKs2iJ4HK_gY0-PxMf8_qLojmbMN7chiDOsDMRT9LTaA5kaUajc8f9BwUzk6gsHxnbuSrtfe27X_xgmiYQyrxtk09KC8',
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios.request(config)
        .then((response) => {
        console.log(response.data);
        location.href = response.data.payWithCard
        if(response.data) {
            this.confirmarPago(total)
        }
            })
            .catch((error) => {
                console.log(error);
                alert(error)
            });
    }


    openPago() {
        const dialogRef = this._matDialog.open(DetallesPagosComponent,
            {
                autoFocus: false,
                data: {
                    idProject: this.idPago,
                },
            }
        );
        //this.generarPrimerDespacho()
        dialogRef.afterClosed().subscribe((result) => {
            console.log('datos para despacho => ', result);
            console.log('idProyecto ', result.idProyect)
            console.log('idModulo ', result.proyect.module._id)
            this.idProyecto = result.idProyect
            this.idModulo = result.proyect.module._id
            this.consultarGuias(result.proyect.module._id);
            //this.generarPrimerDespacho(result.idProyect, result.proyect.module._id)
            // console.log('Enviar', enviar);
            //http://54.81.235.72:3000/api/v1/generate-dispach/660f664ad701b55fa213b1cc/1000
            this._orderPedido.newDespacho(result.idProyect, result.proyect.module._id, result.proyect.transporte.peso).subscribe({
                next: (value) => {
                    console.log('DESPACHOOOOOOO', value);
                    this.estatusDespacho()
                    this.consultarGuias(result.proyect.module._id);

                    this._changeDetectorRef.markForCheck();
                },
                error: (error) => {
                    this.alertService.mensajeError('Error');
                }
            });
        });
    }

}
