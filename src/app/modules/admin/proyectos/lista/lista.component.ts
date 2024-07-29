import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ProyectosPagination, ProyectosDtos } from 'app/modules/admin/proyectos/proyectos.types';
import { ProyectosService } from 'app/modules/admin/proyectos/proyectos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/services/alert.service';

import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class ProyectosListaComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  proyectosDtos: ProyectosDtos[];
  proyectosDtosAux: ProyectosDtos[];
  proyectos$: MatTableDataSource<ProyectosDtos>;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedProyectos: ProyectosDtos | null = null;
  selectedProyectosForm: FormGroup;
  displayedColumns: string[] = ['n', 'cliente', 'construc', 'proyecto'
, 'ubicacion'
/*, 'fecha'
, 'area'
, 'monto'
, 'estado'
, 'ultimo'
, 'estatus'
, 'porcentaje'
, 'valor'*/
/*, 'proximo'
, 'fecha_proximo'
, 'observaciones'*/
,'estado'
, 'accion'];
  actualizar = false;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      private _inventoryService: ProyectosService,
      private readonly alertService: AlertService,
      private _matDialog: MatDialog,
  ) {
      this.consultarProductos();
  }

  ngOnInit(): void {
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

  consultarProductos(): void {
      this.isLoading = true;
      this._inventoryService.findAll("").subscribe(
          (value) => {
              console.log('productossss', value.respon);
              let resp = value

              this.proyectosDtos = value.respon;
              console.log(value.respon)
              this.proyectos$ = new MatTableDataSource(value.respon);
              this.proyectos$.paginator = this._paginator;
              this.proyectos$.sort = this._sort;

              if (this.proyectosDtos.length < 1) {
                  this.alertService.mensajeInfo('No existen productos registrados');
              }
              this.isLoading = false;
          },
          (error) => {
              this.alertService.mensajeError("ERROR");
              this.isLoading = false;
          });
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

              element.scrollIntoView({ behavior: 'smooth', inline: "start" });

              /*Hats aqui */
          },
          (error) => {
              this.alertService.mensajeError("error");

          });
  }

  closeDetails(): void {
      this.selectedProyectos = null;
  }

  cycleImages(forward: boolean = true): void {
      // Get the image count and current image index
      const count = this.selectedProyectosForm.get('images').value.length;
      const currentIndex = this.selectedProyectosForm.get('currentImageIndex').value;

      // Calculate the next and previous index
      const nextIndex = currentIndex + 1 === count ? 0 : currentIndex + 1;
      const prevIndex = currentIndex - 1 < 0 ? count - 1 : currentIndex - 1;

      // If cycling forward...
      if (forward) {
          this.selectedProyectosForm.get('currentImageIndex').setValue(nextIndex);
      }
      // If cycling backwards...
      else {
          this.selectedProyectosForm.get('currentImageIndex').setValue(prevIndex);
      }
  }


  updateSelectedProduct(): void {
      // Get the product object
      const product = this.selectedProyectosForm.getRawValue();
      console.log(product);
      // Remove the currentImageIndex field
      delete product.currentImageIndex;

      // Update the product on the server
      this._inventoryService.updateProduct(product.id, product).subscribe(() => {

          // Show a success message
          this.showFlashMessage('success');
          this.toggleDetails(product.id);
      });
  }


  deleteSelectedProduct(): void {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
          title: 'Eliminar Producto',
          message: '¿Está seguro de que desea eliminar este producto? ¡Esta acción no se puede deshacer!',
          actions: {
              confirm: {
                  label: 'Eliminar'
              }
          }
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

          // If the confirm button pressed...
          if (result === 'confirmed') {

              // Get the product object
              const product = this.selectedProyectosForm.getRawValue();

              // Delete the product on the server
              this._inventoryService.deleteProduct(product.id).subscribe(() => {

                  // Close the details
                  this.closeDetails();
              });
          }
      });
  }

  showFlashMessage(type: 'success' | 'error'): void {
      // Show the message
      this.flashMessage = type;

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Hide it after 3 seconds
      setTimeout(() => {

          this.flashMessage = null;

          // Mark for check
          this._changeDetectorRef.markForCheck();
      }, 3000);
  }






}
