import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
//import { FileManagerListComponent } from 'app/modules/admin/file-manager/list/list.component';
import { CarpetasComponent } from '../carpetas.component';
import { Router } from '@angular/router';
import { ProyectosService } from '../../proyectos.service';
import { Item } from '../file-manager.types';

@Component({
    selector: 'file-manager-details',
    templateUrl: './details.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsCarpetasComponent implements OnInit, OnDestroy {
    item: Item;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fileManagerListComponent: CarpetasComponent,
        private _router: Router,
        private _proyectoService: ProyectosService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this._fileManagerListComponent.matDrawer.open();

        // Get the item
        /*this._fileManagerService.item$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((item: Item) => {
                console.log(item);

                // Open the drawer in case it is closed
                this._fileManagerListComponent.matDrawer.open();

                // Get the item
                this.item = item;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });*/
        this._fileManagerListComponent.matDrawer.open();
        (this.item = {
            /* id: 'ae908d59-07da-4dd8-aba0-124e50289295',
            folderId: null,
            name: 'Memoria Nova',
            createdBy: 'Jorge Carrirllo',
            createdAt: 'Octubre 11, 2023',
            modifiedAt: 'Octubre 11, 2023',
            size: '4.5 MB',
            type: 'PDF',
            contents: null,
            description: null,*/

            id: 'cd6897cb-acfd-4016-8b53-3f66a5b5fc68',
            folderId: null,
            name: 'Documentación Estructural',
            createdBy: 'Diego Haro',
            createdAt: 'April 24, 2018',
            modifiedAt: 'April 24, 2018',
            size: '87 MB',
            type: 'PDF',
            contents: '5 archivos',
            description:
                'Personal documents such as insurance policies, tax papers and etc.',
        }),
            {
                id: 'lista',
                folderId: null,
                name: 'Ordenes de Pedido',
                createdBy: 'Proyectos',
                createdAt: 'April 24, 2018',
                modifiedAt: 'April 24, 2018',
                size: '87 MB',
                type: 'folder',
                contents: '2 files',
                description: 'Lista de Proyectos Cliente.',
            },
            {
                id: 'lista5',
                folderId: null,
                name: 'Memoría Técnica',
                createdBy: 'Proyectos',
                createdAt: 'April 24, 2018',
                modifiedAt: 'April 24, 2018',
                size: '87 MB',
                type: 'folder',
                contents: '2 files',
                description: 'Lista de Proyectos Cliente.',
            },
            {
                id: 'lista2',
                folderId: null,
                name: 'Book Guia',
                createdBy: 'Proyectos',
                createdAt: 'April 24, 2018',
                modifiedAt: 'April 24, 2018',
                size: '87 MB',
                type: 'folder',
                contents: '1 files',
                description: 'Lista de Proyectos Cliente.',
            },
            {
                id: 'lista3',
                folderId: null,
                name: 'Book Ejecución',
                createdBy: 'Proyectos',
                createdAt: 'April 24, 2018',
                modifiedAt: 'April 24, 2018',
                size: '87 MB',
                type: 'folder',
                contents: '1 files',
                description: 'Lista de Proyectos Cliente.',
            },
            {
                id: 'lista4',
                folderId: null,
                name: 'Garantía',
                createdBy: 'Proyectos',
                createdAt: 'April 24, 2018',
                modifiedAt: 'April 24, 2018',
                size: '87 MB',
                type: 'folder',
                contents: '1 files',
                description: 'Lista de Proyectos Cliente.',
            };
        this._changeDetectorRef.markForCheck();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this._fileManagerListComponent.matDrawer.close();
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
}
