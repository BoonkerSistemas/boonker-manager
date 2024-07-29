import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ProyectosService } from '../proyectos.service';
import { AlertService } from '../../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { Item, Items } from './file-manager.types';

@Component({
    selector: 'carpetas',
    templateUrl: './carpetas.component.html',
    styleUrls: ['./carpetas.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarpetasComponent implements OnInit, OnDestroy {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    drawerMode: 'side' | 'over';
    selectedItem: Item;
    items: Items;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    usuario: any = [];
    isLoading: boolean = false;
    actualizar = false;
    id: string;
    cliente: any;
    proyectosDtos: any;
    usuarioLogueado: any = [];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _inventoryService: ProyectosService,
        private readonly alertService: AlertService,
        private _matDialog: MatDialog
    ) {}

    ngOnDestroy(): void {}

    /**
     * On init
     */
    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            // this.id = params.get('id');
            if (params.get('id') === 'full') {
                this.usuario = JSON.parse(localStorage.getItem('user'));
                console.log('USUARIOOOOO', this.usuario);

                this.id = this.usuario._id;
                console.log(this.usuario);
                this.consultarProductos();
            } else {
                this.usuario.id = params.get('id');
            }
        });

        this.usuarioLogueado = JSON.parse(localStorage.getItem('user'));
        /*this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            console.log(params);

            // this.id = params.get('id');
            if (
                params.get('id') === JSON.parse(localStorage.getItem('user')).id
            ) {
                this.usuario = JSON.parse(localStorage.getItem('user'));
                console.log(this.usuario);
            } else {
                this.usuario.id = params.get('id');
                this.id = this.usuario.id;
                this.usuario.role = 'Cliente';
            }
        });*/

        this.consultarProductos();
    }

    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activatedRoute });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    ngAfterViewInit(): void {
        this.consultarProductos();
    }


    consultarProductos() {
        this.isLoading = true;
        console.log('ROLEEEEEEEEEEE', this.usuario.rol);

        if (this.usuario.rol[0].role.toUpperCase() === 'CLIENTE') {
            this._inventoryService.findAll().subscribe(
                (value) => {
                    console.log('productossss Client', value.respon);
                    let resp: any = value;

                    let filtradoCliente = resp.respon.filter(
                        (option) => option.idClient === this.id
                    );
                    console.log(filtradoCliente);
                    let filtrado = { respon: filtradoCliente };

                    this.proyectosDtos = filtrado;
                    this.proyectosDtos.respon = [
                        {
                            idClient: '7556fc50-55c4-11ee-a9cc-875cbddf0c2f',
                            location: 'LOS CHILLOS',
                            m2: '2653,52',
                            createdAt: '2023-09-18T01:52:46.729Z',
                            modules: '4',
                            nombreProyecto: 'NOVACLINICA',
                            date: '2023-06-08',
                            updatedAt: '2023-11-12T05:15:19.525Z',
                            observation: '',
                            userResponsible: 'ING. CARLOS ALVEAR',
                            id: '572f83d1-5a71-45ee-931e-3c9d45f856b0',
                            type: 'Proyecto Hospitalario',
                            folderId: 1,
                        },
                        {
                            idClient: '33526460-55c5-11ee-a9cc-875cbddf0c2f',
                            location: 'Nayon',
                            m2: '420,68',
                            createdAt: '2023-09-18T01:55:54.004Z',
                            modules: '1',
                            nombreProyecto: 'RESIDENCIA ESCUDERO JACOME',
                            date: '2023-06-09',
                            data: [],
                            updatedAt: '2023-09-18T01:55:54.004Z',
                            observation: '',
                            userResponsible: 'ING. CHRISTIAN ESCUDERO',
                            id: '0b1c45e5-cddf-400c-8b7e-8e1470ff2193',
                            type: 'casa',
                            documentId: 1,
                        },
                    ];

                    console.log('productossssDTOS Client', this.proyectosDtos);
                    if (this.proyectosDtos.length < 1) {
                        this.alertService.mensajeInfo(
                            'No existen productos registrados'
                        );
                    }

                    this.proyectosDtos.respon.forEach((val) => {
                        folders.push({
                            id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc71',
                            folderId: null,
                            name: val.nombreProyecto,
                            createdBy: 'Diego Haro',
                            createdAt: val.date,
                            modifiedAt: val.updatedAt,
                            size: '87 MB',
                            type: 'folder',
                            contents: '2 archivos',
                            description: val.nombreProyecto,
                        });
                    });

                    let itemsData = { folders: [], files: [], path: [] };

                    itemsData = {
                        //folders: folders,
                        folders: [],
                        files: [
                            {
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                                folderId:
                                    'cd6897cb-acfd-4016-8b53-3f66a5b5fc71',
                                name: 'Documentación_Estructural_nova',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'file',
                                contents: '1 archivos',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },
                            {
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5544',
                                folderId: 'lista2',
                                name: 'Memoria_tecnica_nova',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'file',
                                contents: '1 archivos',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },
                            {
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                                folderId: 'lista3',
                                name: 'Documentación_guia_nova',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'XLS',
                                contents: '1 archivos',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },
                            {
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                                folderId: 'lista3',
                                name: 'Documentación_ejecucion_nova',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'DOC',
                                contents: '1 archivos',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },
                            {
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                                folderId: 'lista3',
                                name: 'certificados_nova',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'PDF',
                                contents: '1 archivos',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },
                        ],
                        path: [
                            /*{
                                id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
                                folderId: null,
                                name: 'Personal',
                                createdBy: 'Diego Haro',
                                createdAt: 'April 24, 2018',
                                modifiedAt: 'April 24, 2018',
                                size: '87 MB',
                                type: 'folder',
                                contents: '57 files',
                                description:
                                    'Personal documents such as insurance policies, tax papers and etc.',
                            },*/
                        ],
                    };

                    this.items = itemsData;
                    this._changeDetectorRef.markForCheck();

                    // Subscribe to media query change
                    this._fuseMediaWatcherService
                        .onMediaQueryChange$('(min-width: 1440px)')
                        .pipe(takeUntil(this._unsubscribeAll))
                        .subscribe((state) => {
                            // Calculate the drawer mode
                            this.drawerMode = state.matches ? 'side' : 'over';

                            // Mark for check
                            this._changeDetectorRef.markForCheck();
                        });

                    this.isLoading = false;
                    this._changeDetectorRef.markForCheck();
                    return this.proyectosDtos;
                },
                (error) => {
                    this.alertService.mensajeError(
                       "Erroe en el servidor"
                    );
                    this.isLoading = false;
                }
            );
        } else {
            this._inventoryService.findAll().subscribe(
                (value) => {
                    let resp: any[] = value;

                    this.proyectosDtos = resp;
                    console.log('productossss cualquiera', this.proyectosDtos);

                    if (this.proyectosDtos.length < 1) {
                        this.alertService.mensajeInfo(
                            'No existen productos registrados'
                        );
                    }
                    this.isLoading = false;
                    //this._changeDetectorRef.markForCheck();
                    return this.proyectosDtos;
                },
                (error) => {
                    this.alertService.mensajeError(
                      "Error en el Servidor"
                    );
                    this.isLoading = false;
                }
            );
        }

        let folders = [];
    }
}
