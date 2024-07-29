import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {  DespachosDtos } from 'app/modules/admin/despachos/despachos.types';
import { DespachosService } from 'app/modules/admin/despachos/despachos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/services/alert.service';

import { MatDialog } from '@angular/material/dialog';

import { DespachosDetallesComponent } from '../detalles/detalles.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class DespachosListaComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  despachos$: MatTableDataSource<DespachosDtos>;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedDespachos: DespachosDtos | null = null;
  selectedDespachosForm: FormGroup;
  displayedColumns: string[] = ['n', 'cliente', 'construc', 'pedido', 'accion'];
  actualizar = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      private _inventoryService: DespachosService,
      private readonly alertService: AlertService,
      private _matDialog: MatDialog,
  ) {
     // this.consultarProductos();
  }

  ngOnInit(): void {
      this.selectedDespachosForm = this._formBuilder.group({
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
   //   this.despachos$ =  new MatTableDataSource([]);
   let mio = [{
    id:1,
    client:'Jorge Carrillo',
    construction:'El Condado',
    project: 'Vivienda Individual',
    op:1

   },
       {
           id:2,
           client:'Jorge Carrillo',
           construction:'El Condado',
           project: 'Vivienda Individual',
           op:1

       }]
    let op =  localStorage.getItem('opc')
      console.log(op)
      let opJson = JSON.parse(op)

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
      if (this.selectedDespachos && this.selectedDespachos.id === productId) {
          // Close the details
          this.closeDetails();
          return;
      }
      this._inventoryService.findOneById(productId).subscribe(
          (value) => {
              console.log('productossss', value);
              // Set the selected product
              this.selectedDespachos = value;
              // Fill the form
              this.selectedDespachosForm.patchValue(value);
              // Mark for check
              this._changeDetectorRef.markForCheck();

              /*desde Aui */
              const element = document.getElementById('second');

              element.scrollIntoView({ behavior: 'smooth', inline: "start" });

              /*Hats aqui */
          },
          (error) => {
              this.alertService.mensajeError("Error");

          });
  }

  closeDetails(): void {
      this.selectedDespachos = null;
  }







   /**
     * Open the note dialog
     */
   openProyectDialog(proyect): void
   {
    console.log('pruebs', proyect);

      /* this._matDialog.open(DespachosDetallesComponent, {
           autoFocus: false,
           data     : {
               proyect: proyect
           }
       });*/
       this._matDialog.open(DespachosDetallesComponent, {
        autoFocus: false,
        data     : {
            proyect: proyect
        }
    });
   }
/**
     * Add a new note
     */
addNewProyect(): void
{
    const dialogRef =  this._matDialog.open(DespachosDetallesComponent, {
        autoFocus: false,
        data     : {
            proyect: {}
        }
    });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');


        });

}

}
