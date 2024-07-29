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
import { AlertService } from 'app/services/alert.service';

import { MatTableDataSource } from '@angular/material/table';

interface Food {
    value: string;
    viewValue: string;
    peso: number;
}
declare let $: any;
import { map, Observable, of } from 'rxjs';
import { DespachosService } from '../../despachos/despachos.service';
import { SlideService } from 'app/services/slide/slide.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector: 'app-detalles',
    templateUrl: './detalles.component.html',
    styleUrls: ['./detalles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DespachosDetallesClienteComponent implements OnInit, OnDestroy {
    displayedColumns: string[] = [
        'id',
        'descripcion',
        'porcentaje',
        'unidades',
        'cantidad',
        'peso',
        'total',
        'totalP',
    ];
    seccion2$: MatTableDataSource<any>;
    pedido$: Observable<any>;
    selected = '';
    dataTabla = [];

    foods: Food[] = [
        { value: '1', viewValue: 'Trailer (30 Tolenadas)', peso: 30000 },
        { value: '2', viewValue: 'Trailer Provincia (28 Tolenadas)', peso: 28000 },
        { value: '3', viewValue: 'Mula (24 Tolenadas)', peso: 24000 },
        { value: '4', viewValue: 'Mula Provincia (22 Tolenadas)', peso: 22000 },
        { value: '5', viewValue: 'Camion (18 Tolenadas)', peso: 18000 },
        { value: '6', viewValue: 'Camion Provincia (14 Tolenadas)', peso: 14000 },
        { value: '7', viewValue: 'Camion (8 Tolenadas)', peso: 8000 },
        { value: '8', viewValue: 'Camioneta (1 Tolenadas)', peso: 1000 },
    ];

    keyword = 'viewValue';
    rol: any[];
    tipo: any = [];
    keywordModule = 'module';
    dataModule: any[];
    tipoModule: any = [];
    project = '';
    client: any = [];

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) private _data: { proyect; idProyect },
        private _despachosService: DespachosService,
        private _matDialogRef: MatDialogRef<DespachosDetallesClienteComponent>,
        private readonly alertService: AlertService,
        private _project: SlideService,
        private _activatedRoute: ActivatedRoute
    ) {
        this.consultarCliente();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    fecha = new Date();
    fechaPoner = new Date().setDate(this.fecha.getDate() + 7);

    /**
     * On init
     */
    ngOnInit(): void {
        console.log('PRUEBA', this._data);
        console.log('PRUEBA', this._data.idProyect);

        // Edit
        if (this._data.proyect.id) {
            // console.log(this._data.proyect.id);

            if (this._data.proyect.id === 1) {
                const pedido = {
                    id: this._data.proyect.id,
                    cliente: '',
                    codigo: '',
                    proyecto: '',
                    ordenDespacho: '',
                    modulo: '',
                    totalP: '',
                };

                this.pedido$ = of(pedido);

                let mio = [
                    {
                        id: 1,
                        name: 'PALLETS BLOQUE BKR 12 MPA BISELADO LINEA MAESTRA',
                        porcentaje: '',
                        unidades: 'PALLETES 144 UNID',
                        cantidad: 1.5,
                        peso: 1.7,
                        total: 2.556,
                    },
                    {
                        id: 1,
                        name: 'SACOS GROUT DE NIVELACION',
                        porcentaje: '',
                        unidades: 'SACO 25',
                        cantidad: 21.0,
                        peso: 25,
                        total: 525.0,
                    },
                    {
                        id: 2,
                        name: 'PALLETS BLOQUE BKR 12 MPA BISELADO',
                        porcentaje: '70%',
                        unidades: 'PALLETES 144 UNID',
                        cantidad: 13.7,
                        peso: 1.7,
                        total: 23.352,
                    },
                    {
                        id: 2,
                        name: 'SACOS GROUT ESTRUCTURAL ESTANDAR',
                        porcentaje: '70%',
                        unidades: 'SACO25',
                        cantidad: 148.8,
                        peso: 25,
                        total: 3.72,
                    },
                ];
                this.seccion2$ = new MatTableDataSource(mio);
            }
            if (this._data.proyect.id === 2) {
                const pedido = {
                    id: this._data.proyect.id,
                    cliente: '',
                    codigo: '',
                    proyecto: '',
                    ordenDespacho: '',
                    modulo: '',
                    totalP: '',
                };

                this.pedido$ = of(pedido);

                let mio = [
                    {
                        id: 3,
                        name: 'M LINEALES DE DINTELES',
                        porcentaje: '',
                        unidades: 'ML',
                        cantidad: 31.1,
                        peso: 30,
                        total: 1.245,
                    },
                    {
                        id: 4,
                        name: 'PALLETES BLOQUE BKR 12 MPA BISELADO ',
                        porcentaje: '30%',
                        unidades: 'PALLETES 144 UNID',
                        cantidad: 9.2,
                        peso: 1.7,
                        total: 15.568,
                    },
                    {
                        id: 4,
                        name: 'SACOS GROUT ESTRUCTURAL ESTANDAR',
                        porcentaje: '30%',
                        unidades: 'SACO 25',
                        cantidad: 99.2,
                        peso: 25,
                        total: 2.48,
                    },
                    {
                        id: 5,
                        name: 'SACOS BOONKER SEAL ESTANDAR',
                        porcentaje: '',
                        unidades: 'SACO 25',
                        cantidad: 44.0,
                        peso: 25,
                        total: 1.1,
                    },
                ];
                this.seccion2$ = new MatTableDataSource(mio);
            }
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
    ngOnDestroy(): void {}

    updateNoteDetails(pedido: any): void {
        // console.log(pedido);

        this._despachosService
            .updateOneById(pedido)
            .pipe(
                map((llego) => {
                    // console.log(llego);
                })
            )
            .subscribe();
    }

    setSelected(recibe) {
        this.dataTabla = [];
        this._data.proyect.transporte = recibe;
    }

    generar() {
        this._matDialogRef.close(this._data);
    }

    onNoClick(): void {
        this._matDialogRef.close();
    }

    selectEvent(item) {
        console.log(item);
        this.tipo = item ? item : '';
        this.dataTabla = [];
        this._data.proyect.transporte = item;
        //this.consultarGuias(item._id);
        //item.deselect();
    }

    onChangeSearch(val: string) {
        // console.log(val);
    }

    onFocused(e) {
        // console.log(e);
    }

    selectEventModule(item) {
        console.log(item);
        this.tipoModule = item ? item : '';
        this._data.proyect.module = item;
        //this.consultarGuias(item._id);
        //item.deselect();
    }

    onChangeSearchModule(val: string) {
        // console.log(val);
    }

    onFocusedModule(e) {
        // console.log(e);
    }

    consultarCliente() {
        try {
            let roles = [];
            this._project
                .findOneById(this._data.idProyect)
                .subscribe((data) => {
                    this.client = data;
                    console.log(this.client);
                    this.client.module.forEach((item) => {
                        item.module = 'Modulo ' + item.module;
                        roles.push(item);
                    });
                    this.dataModule = roles;
                    console.log('ROLESSSSS', this.dataModule);
                    this._changeDetectorRef.markForCheck();
                    this._changeDetectorRef.markForCheck();
                    //this.nameProject = this.client
                });
            console.log(this.client);
        } catch (e) {
            console.log(e);
        }
    }
}
