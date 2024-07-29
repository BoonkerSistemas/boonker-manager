import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule} from "@angular/material/sort";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {SlideService} from "../../../../services/slide/slide.service";
import {AlertService} from "../../../../services/alert.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {ImagenComponent} from "../activos/imagen/imagen.component";
import {ViewComponent} from "../activos/view/view.component";
import Swal from "sweetalert2";

@Component({
    selector: 'app-list-upload',
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule, MatTableModule, MatTooltipModule],
    templateUrl: './list-upload.component.html',
    styleUrl: './list-upload.component.scss'
})
export class ListUploadComponent implements OnInit {
    data: MatTableDataSource<any>;
    displayedColumns: string[] = [
        "titulo",
        "autor",
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
    idEdit: string;
    generalData: any;

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activosService: SlideService,
        private readonly alertService: AlertService,
        private routerService: Router,
        private _activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnDestroy(): void {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            console.log(params.get("id"));
            this.idEdit = params.get("id");
        });
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
        this._activosService.findOneById(this.idEdit).subscribe((data: any) => {
            console.log(data);
            this.generalData = data
            this.dataF = data.documentationProject;
            this.data = new MatTableDataSource(data.documentationProject);
            this.data.paginator = this.paginator;
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
            this.routerService.navigateByUrl("/upload-file/" + this.idEdit);
        }
    }

    verImagen(element) {
       this.openDialog(element)
    }

    verElemento(element) {

        this.routerService.navigateByUrl("/file-upload/" + element._id);
    }

    cerrar() {
        this.imagenSlider = "";
    }

    eliminarSlider(element) {
        Swal.fire({
            title: "¿Deseas eliminar este documento?",

            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, quiero eliminar!",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(element)

                let aux = this.generalData.documentationProject.filter(
                    (acl) =>
                        acl.file !== element.file
                )
                this.generalData.documentationProject = aux
                delete this.generalData.ruc
                this._activosService.updateOneById(this.generalData).subscribe((data: any) => {
                    this.alertService.mensajeSuccess("Documento eliminado correctamente");
                    this.cargarDatos();
                }, (error) => {
                    this.alertService.mensajeError("Error al eliminar el documento");
                });

            }
        });
    }
}
