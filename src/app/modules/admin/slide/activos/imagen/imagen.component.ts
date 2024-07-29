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
import {Subject} from "rxjs";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef,} from "@angular/material/dialog";
import {fuseAnimations} from "@fuse/animations";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SlideService} from "../../../../../services/slide/slide.service";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";


@Component({
    selector: "crearCalificacion",
    templateUrl: "./imagen.component.html",
    styleUrls: ["./imagen.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagenComponent implements OnInit, OnDestroy {
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

    pdfSrc: any;
    element: any;
    rowDetails: any = [];
    region: string = "";

    budgetDetails: any = {
        columns: ["region"],
    };

    plaza: string = "";

    edit = false;

    dataF = []
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<ImagenComponent>,
        @Inject(MAT_DIALOG_DATA) public data1: any,
    ) {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
        console.log(this.data1)
        this.edit = this.data1 != '';
        this.pdfSrc = this.data1.file

    }


    ngOnDestroy(): void {
    }


    download() {

        let nameFile = this.data1.toString().split('/')
        nameFile.length
        let name = nameFile[nameFile.length - 1]
        /*this.httpClient.get(this.pdfSrc, {responseType: 'blob'})
            .subscribe(blob => {
                saveAs(blob, this.data1.type + '_' +name);
            }, err => {
                console.error('Download failed', err);
            });*/

        window.open(this.pdfSrc, "_blank");


    }
}
