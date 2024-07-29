import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { AlertService } from "../../../../services/alert.service";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { SlideService } from "../../../../services/slide/slide.service";
import Swal from "sweetalert2";
import { ImagenComponent } from "../activos/imagen/imagen.component";
import { ViewComponent } from "../activos/view/view.component";

@Component({
  selector: "inactivos",
  templateUrl: "./inactivos.component.html",
  styleUrls: ["./inactivos.component.scss"],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InactivosComponent implements OnInit, OnDestroy {
    data: MatTableDataSource<any>;
    displayedColumns: string[] = [
        "titulo",
        "autor",
        "fechaInicio",
        "fechaFin",
        "curso",
        "client",
        "accion",
    ];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    imagenSlider: string;
    element: any;
    rowDetails: any = [];
    region: string = "";
    budgetDetails: any = {
        columns: ["region"],
    };


    edit = false;


    dataF = [];

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activosService: SlideService,
        private readonly alertService: AlertService,
        private routerService: Router
    ) {
    }

    ngOnDestroy(): void {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this.cargarDatos();
    }

    openDialog(element): void {
        const dialogRef = this.dialog.open(ImagenComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.cargarDatos();
        });
        this.cargarDatos();
    }

    openDialogTwo(element): void {
        const dialogRef = this.dialog.open(ViewComponent, {
            data: element,
        });

        dialogRef.afterClosed().subscribe((result) => {
            this.cargarDatos();
        });
        this.cargarDatos();
    }

    cargarDatos() {
        this._activosService.findAllStatus(false).subscribe((data) => {
            console.log(data);
            data.sort(function (a, b) {
                var textA = new Date(a.updatedAt).getTime();
                var textB = new Date(b.updatedAt).getTime();
                return textA > textB ? -1 : textA < textB ? 1 : 0;
            });
            console.log(data);
            this.dataF = data;
            this.data = new MatTableDataSource(data);
            this.data.paginator = this.paginator;
            this.data.sort = this.sort;
            this._changeDetectorRef.markForCheck();
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();
        if (this.data.paginator) {
            this.data.paginator.firstPage();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    nuevo(): void {
        {
            this.routerService.navigateByUrl("/projects/new-project");
        }
    }

    verImagen(element) {
        console.log(element.image);
        this.imagenSlider = element.imageUrlDesktop;
        this.openDialog(this.imagenSlider);
    }

    verElemento(element) {

        this.element = element;

        this.openDialogTwo(element);
    }

    cerrar() {
        this.imagenSlider = "";
    }

    eliminarSlider(element) {
        Swal.fire({
            title: "¿Deseas eliminar este campo?",

            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, quiero eliminar!",
        }).then((result) => {
            if (result.isConfirmed) {
                this._activosService.delete(element).subscribe((data) => {
                    this.alertService.mensajeSuccess("Eliminado Correctamente");
                    this.cargarDatos();
                    this._changeDetectorRef.markForCheck();
                });
            }
        });
    }
}
