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
import {FormBuilder, FormGroup, Validators,} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {Subject} from 'rxjs';
import {fuseAnimations} from '@fuse/animations';
import {ProyectosDtos,} from 'app/modules/admin/proyectos/proyectos.types';
import {ProyectosService} from 'app/modules/admin/proyectos/proyectos.service';
import {MatTableDataSource} from '@angular/material/table';
import {AlertService} from 'app/services/alert.service';

import {MatDialog} from '@angular/material/dialog';

import {ActivatedRoute, ParamMap} from '@angular/router';
import {SlideService} from "../../../../services/slide/slide.service";
import {PedidosDetallesComponent} from "../detalles/detalles.component";
import {ModuleService} from "../../../../services/module/module.service";

@Component({
    selector: 'app-lista-proyectos',
    templateUrl: './lista-proyectos.component.html',
    styleUrls: ['./lista-proyectos.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class ListaProyectosComponent
    implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    proyectosDtos: any ;
    proyectos$: MatTableDataSource<ProyectosDtos>;
    isLoading: boolean = false;
    selectedProyectos: ProyectosDtos | null = null;
    selectedProyectosForm: FormGroup;
    displayedColumns: string[] = [
        'n',
        'cliente',
        'construc',
        'proyecto',
        'ubicacion',
        'estado',
        'accion',
    ];
    actualizar = false;
    usuario: any = [];
    id: string;
    cliente: any;
    usuarioLogueado: any = [];

    project = ""
    client: any = []

    module: any = []

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
        private _module: ModuleService,
        private route: ActivatedRoute,
        private _activatedRoute: ActivatedRoute
    ) {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.project = params.get('id')
            localStorage.setItem('project', this.project)
            this.consultarProductos();
        });


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
        console.log("sadsadasdasdasdas")
        try {
            this._project.findOneById(this.project).subscribe(data => {
                this.client = data
            })
            console.log(this.client)
        } catch (e) {
            console.log(e)
        }

    }

    consultarModule(id) {
        console.log("module", id)
        try {
            this._module.findOneById(id).subscribe(data => {
                this.module = data
            })

        } catch (e) {
            console.log(e)
        }

    }


    async consultarProductos() {
        this.isLoading = true;
        await this.consultarCliente()
        let data: any = []
        // ...
        this._inventoryService.findAll(this.project).subscribe(
            async (value) => {

                console.log(value)
                this.proyectosDtos = value;

                if (this.proyectosDtos.length < 1) {
                    await this.alertService.mensajeInfo(
                        'No existen productos registrados'
                    );
                }
                this.isLoading = false;
                return this.proyectosDtos;
            });

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

    toggleDetails(productId): void {
        this.actualizar = true;
        console.log('productoooo', productId);

        // If the product is already selected...
        if (this.selectedProyectos && this.selectedProyectos.id === productId) {
            // Close the details
            this.closeDetails();
            return;
        }
        this._inventoryService.findOneById(productId).subscribe(
            (value) => {
                console.log('productossss', value);
                // Set the selected product
                this.selectedProyectos = value;
                // Fill the form
                this.selectedProyectosForm.patchValue(value);
                // Mark for check
                this._changeDetectorRef.markForCheck();

                /*desde Aui */
                const element = document.getElementById('second');

                element.scrollIntoView({behavior: 'smooth', inline: 'start'});

                /*Hats aqui */
            },
            (error) => {
                this.alertService.mensajeError(
                    "Error"
                );
            }
        );
    }

    closeDetails(): void {
        this.selectedProyectos = null;
    }


    addNewOrdenPedido(id): void {
        alert(id)
        localStorage.setItem('module', id)

        const dialogRef = this._matDialog.open(PedidosDetallesComponent, {
            autoFocus: false,
            data: {
                proyect: {idCliente: id},
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');

            this.consultarProductos();
        });
    }

    deleteOrden(id): void {

    }

}
