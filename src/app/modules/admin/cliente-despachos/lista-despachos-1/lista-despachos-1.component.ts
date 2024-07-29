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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ProyectosDtos } from 'app/modules/admin/proyectos/proyectos.types';
import { ProyectosService } from 'app/modules/admin/proyectos/proyectos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/services/alert.service';

import { MatDialog } from '@angular/material/dialog';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SlideService } from '../../../../services/slide/slide.service';
import { ModuleService } from '../../../../services/module/module.service';
import {OrdenPedidoService} from "../../../../services/ordenPedido/ordenPedido.service";
import {OrdenPedidoEnviadasService} from "../../../../services/ordenPedidoEnviadas/ordenPedidoEnviadas.service";

@Component({
    selector: 'app-lista-despachos-1',
    templateUrl: './lista-despachos-1.component.html',
    styleUrls: ['./lista-despachos-1.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListaDespachos1Component
    implements OnInit, AfterViewInit, OnDestroy
{
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
        'guia',
        'pedido',
        'modulo',
        'estatus',
        'despachado',
        'porDespachar',
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

    mostrarTabla = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

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
        private _orderPedidoEnviadas: OrdenPedidoEnviadasService,
        private _module: ModuleService,
        private route: ActivatedRoute,
        private _activatedRoute: ActivatedRoute,
        private routerService: Router
    ) {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.project = params.get('id');
            localStorage.setItem('project', this.project);
            this.consultarProductos();
        });
    }

    async ngOnInit(): Promise<void> {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');

            console.log(params.get('id'));
        });

        await this.consultarOrdenPedidoEnviadas()
    }

    async consultarCliente() {

        try {
            this._project.findOneById(this.project).subscribe((data) => {
                this.client = data;
                console.log(this.client);
                console.log(this.client.module[0]._id);
                this.consultarGuias(this.client.module[0]._id)
                //this.nameProject = this.client
            });
            console.log(this.client);
        } catch (e) {
            console.log(e);
        }
    }


    async consultarOrdenPedidoEnviadas() {

        try {
            this._orderPedidoEnviadas.findOneById('66956b9c16791c663a9e56f0').subscribe(async (data: any) => {

                console.log(data)
               let data1 = data;

                this.pedido = data
                this.proyectosOp$ = new MatTableDataSource(data1);

                console.log("aquiiiiiii", this.proyectosOp$)
                this.proyectosOp$.paginator = this.paginator;
                this._changeDetectorRef.markForCheck();

                if (this.proyectosDtos.length < 1) {
                    await this.alertService.mensajeInfo(
                        'No existen productos registrados'
                    );
                }
                this.isLoading = false;

                return data1;
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

    consultarGuias(idModule) {
        console.log('idmodulo => ', idModule)
        this._orderPedido.generateDespacho(idModule).subscribe((value) => {
            console.log('Guias', value[0].enviado);
            
            //this.title = value.name;
            this._changeDetectorRef.markForCheck();
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
                despachado: {m2:20,detalle:[
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
                ]},
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
            '/detallesMateriales/66956b9c16791c663a9e56f0'
        );
    }


    visualizarEnvio(data) {

        window.open('https://boonker-construcciones.s3.amazonaws.com/RESIDENCIA+ROSALES+ACOSTA/RESIDENCIA-ROSALES-JBA6593.pdf');
    }
}
