import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {  Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {  PedidosDtos } from 'app/modules/admin/pedidos/pedidos.types';
import { PedidosService } from 'app/modules/admin/pedidos/pedidos.service';
import { MatTableDataSource } from '@angular/material/table';
import { AlertService } from 'app/services/alert.service';

import { MatDialog } from '@angular/material/dialog';
import { PedidosDetallesComponent } from '../detalles/detalles.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class PedidosListaComponent  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  pedidosDtos: PedidosDtos[];
  pedidos$: MatTableDataSource<PedidosDtos>;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  selectedPedidos: PedidosDtos | null = null;
  selectedPedidosForm: FormGroup;
  displayedColumns: string[] = ['n', 'cliente', 'proyecto','modulo', 'pedido', 'peso', 'accion'];
  actualizar = false;
  idCliente = '';

  private _unsubscribeAll: Subject<any> = new Subject<any>();


  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      private _inventoryService: PedidosService,
      private readonly alertService: AlertService,
      private _matDialog: MatDialog,
      private readonly activatedRouteService: ActivatedRoute,
  ) {
      this.consultarProductos();
  }

  ngOnInit(): void {

    this.activatedRouteService.params.subscribe(
        async (parametros) => {
            console.log('PARAMETRO POR RUTA',parametros.id);
            this.idCliente = parametros.id;
        })

      this.selectedPedidosForm = this._formBuilder.group({
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
      this._inventoryService.findAll().subscribe(
          (value) => {


              this.pedidosDtos = value.respon;
              this.pedidos$ = new MatTableDataSource(value.respon);
              this.pedidos$.paginator = this._paginator;
              this.pedidos$.sort = this._sort;

              if (this.pedidosDtos.length < 1) {
                  this.alertService.mensajeInfo('No existen Pedidos registrados');
              }
              this.isLoading = false;
          },
          (error) => {
            console.log('AQUIIIII', error);

              this.alertService.mensajeError("Error en el servidor");
              this.isLoading = false;
          });
  }


  applyFilter(event: Event): void {
      this.isLoading = true;
      const filterValue = (event.target as HTMLInputElement).value;
      this.pedidos$.filter = filterValue.trim().toLowerCase();
      if (this.pedidos$.paginator) {
          this.pedidos$.paginator.firstPage();
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
      if (this.selectedPedidos && this.selectedPedidos.id === productId) {
          // Close the details
          this.closeDetails();
          return;
      }
      this._inventoryService.findOneById(productId).subscribe(
          (value) => {
              console.log('productossss', value);
              // Set the selected product
              this.selectedPedidos = value;
              // Fill the form
              this.selectedPedidosForm.patchValue(value);
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
      this.selectedPedidos = null;
  }



}
