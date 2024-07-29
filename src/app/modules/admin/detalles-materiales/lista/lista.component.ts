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
import {
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import { DetallesMaterialesComponent } from '../detalles/detalles.component';
import { DetallesMaterialesService } from '../detalles-materiales.service';
import { DetallesMaterialesDtos } from '../detalles-materiales.types';

@Component({
    selector: 'app-lista-materiales',
    templateUrl: './lista.component.html',
    styleUrls: ['./lista.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class DetallesMaterialesListaComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    despachos$: MatTableDataSource<DetallesMaterialesDtos>;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    selectedDetallesMateriales: DetallesMaterialesDtos | null = null;
    selectedDetallesMaterialesForm: FormGroup;
    displayedColumns: string[] = [
        'n',
        'cliente',
        'construc',
        'pedido',
        'accion',
    ];
    actualizar = false;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _inventoryService: DetallesMaterialesService,
        private readonly alertService: AlertService,
        private _matDialog: MatDialog
    ) {

    }

    ngOnInit(): void {
        this.selectedDetallesMaterialesForm = this._formBuilder.group({
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

        let mio = [
            {
                id: 1,
                client: 'Jorge Carrillo',
                construction: 'El Condado',
                project: 'Vivienda Individual',
                op: 1,
            },
            {
                id: 2,
                client: 'Jorge Carrillo',
                construction: 'El Condado',
                project: 'Vivienda Individual',
                op: 1,
            },
        ];
        let op = localStorage.getItem('opc');
        console.log(op);
        let opJson = JSON.parse(op);

        this.despachos$ = new MatTableDataSource(mio);
    }



    applyFilter(event: Event): void {
        this.isLoading = true;
        const filterValue = (event.target as HTMLInputElement).value;
        this.despachos$.filter = filterValue.trim().toLowerCase();
        if (this.despachos$.paginator) {
            this.despachos$.paginator.firstPage();
            this.isLoading = false;
        }
        this.isLoading = false;
    }

    ngAfterViewInit(): void {
        // this.consultarProductos();
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
        if (
            this.selectedDetallesMateriales &&
            this.selectedDetallesMateriales.id === productId
        ) {
            // Close the details
            this.closeDetails();
            return;
        }
        this._inventoryService.findOneById(productId).subscribe(
            (value) => {
                console.log('productossss', value);
                // Set the selected product
                this.selectedDetallesMateriales = value;
                // Fill the form
                this.selectedDetallesMaterialesForm.patchValue(value);
                // Mark for check
                this._changeDetectorRef.markForCheck();

                /*desde Aui */
                const element = document.getElementById('second');

                element.scrollIntoView({ behavior: 'smooth', inline: 'start' });

                /*Hats aqui */
            },
            (error) => {
                this.alertService.mensajeError(
                   "Error inesperado"
                );
            }
        );
    }

    closeDetails(): void {
        this.selectedDetallesMateriales = null;
    }

    cycleImages(forward: boolean = true): void {
        // Get the image count and current image index
        const count =
            this.selectedDetallesMaterialesForm.get('images').value.length;
        const currentIndex =
            this.selectedDetallesMaterialesForm.get('currentImageIndex').value;

        // Calculate the next and previous index
        const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
        const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

        // If cycling forward...
        if (forward) {
            this.selectedDetallesMaterialesForm
                .get('currentImageIndex')
                .setValue(nextIndex);
        }
        // If cycling backwards...
        else {
            this.selectedDetallesMaterialesForm
                .get('currentImageIndex')
                .setValue(prevIndex);
        }
    }


    /**
     * Open the note dialog
     */
    openProyectDialog(proyect): void {
        console.log('pruebs', proyect);

        /* this._matDialog.open(DetallesMaterialesDetallesComponent, {
           autoFocus: false,
           data     : {
               proyect: proyect
           }
       });*/
        this._matDialog.open(DetallesMaterialesComponent, {
            autoFocus: false,
            data: {
                proyect: proyect,
            },
        });
    }
    /**
     * Add a new note
     */
    addNewProyect(): void {
        const dialogRef = this._matDialog.open(DetallesMaterialesComponent, {
            autoFocus: false,
            data: {
                proyect: {},
            },
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log('The dialog was closed');

        });
    }
}
