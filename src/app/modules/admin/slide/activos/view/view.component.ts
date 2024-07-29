import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from "@angular/material/dialog";
import {fuseAnimations} from "@fuse/animations";
import {MatTableDataSource} from "@angular/material/table";
import {AlertService} from "../../../../../services/alert.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SlideService} from "../../../../../services/slide/slide.service";
import {Router} from "@angular/router";
import {CrearComponent} from "../../crear/crear.component";



@Component({
    selector: "crearCalificacion",
    templateUrl: "./view.component.html",
    styleUrls: ["./view.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent implements OnInit, OnDestroy {
    data: MatTableDataSource<any>;
    displayedColumns: string[] = [
        "titulo",
        "autor",
        "fechaInicio",
        "fechaFin",
        "curso",
        "tiempo",
        "accion",
    ];

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    imagenSlider: string;
    element: any;
    rowDetails: any = [];
    region: string = "";
    dataregiones = [];
    budgetDetails: any = {
        columns: ["region"],
    };
    budgetDetailsPlaza: any = {
        columns: ["plaza", "region", "descripcion"],
    };
    plaza: string = "";
    rowDetailsPlaza: any = [];
    edit = false;
    dataplazas = [];

    budgetDetailnd: any = {
        columns: ["distribuicion"],
    };
    rowDetailsnd: any = [];

    distribuidora: string = "";
    datadistribucion = [];
    dataF = []

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private _activosService: SlideService,
        private routerService: Router,
        public dialogRef: MatDialogRef<ViewComponent>,
        @Inject(MAT_DIALOG_DATA) public data1: any,
    ) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        this.edit = this.data1 != '';

        this.verElemento(this.data1)
        this.cargarDatos();
    }



    ngOnDestroy(): void {
    }


    openDialog(element): void {
        const dialogRef = this.dialog.open(CrearComponent, {
            data: element
        });

        dialogRef.afterClosed().subscribe(result => {
            this.cargarDatos();
        });
        this.cargarDatos();
    }



    cargarDatos() {
        this._activosService.findAllStatus(true).subscribe((data) => {
            this.dataF = data
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

    verElemento(element) {
        console.log(element);
        this.element = element;
        this.dataregiones = element.regionId;
        this.rowDetails = new MatTableDataSource(element.regionId);

        this.dataplazas = element.plazaId;
        this.rowDetailsPlaza = new MatTableDataSource(element.plazaId);

        this.datadistribucion = element.nivelDistribucionId;
        this.rowDetailsnd = new MatTableDataSource(element.nivelDistribucionId);
    }



    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    nuevo(): void {
        {
            this.routerService.navigateByUrl("/projects/new-project");
        }
    }




    cerrar() {
        this.imagenSlider = "";
    }

}
