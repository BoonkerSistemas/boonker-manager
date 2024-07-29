import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DetallesDocumentoComponent } from './detalles/detallesDocumento.component';
import { MatDialog } from '@angular/material/dialog';
import { VisitaObraService } from 'app/services/visita-obra/visita-obra.service';

@Component({
    selector: 'app-visita-obra',
    templateUrl: './visita-obra.component.html',
    styleUrl: './visita-obra.component.scss',
})
export class VisitaObraComponent {
    inventaryColumns: any = ['code', 'store', 'amount'];

    inventary: any = [];
    @ViewChild('paginator') paginator: MatPaginator;

    progress = 0;
    imageUrlDesktop = '';
    message: any;
    idProyect;
    documentos: any = [];
    pdfSrc;

    constructor(
        private visitaObraService: VisitaObraService,
        private _activatedRoute: ActivatedRoute,
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.idProyect = params.get('idProyect');

            console.log(params);
        });
    }

    ngOnInit(): void {
        this.getInventary();
    }

    getInventary() {
        this.visitaObraService.findAll(this.idProyect).subscribe((data) => {
            console.log('dataaa', data);

            data.forEach((element) => {
                if (element.s31) {
                    this.documentos.push(element);
                }
            });
            this.inventary = new MatTableDataSource(data);
            this.inventary.paginator = this.paginator;
            this._changeDetectorRef.markForCheck();
        });
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        console.log(filterValue);
        this.inventary.filter = filterValue.trim().toLowerCase();
        if (this.inventary.paginator) {
            this.inventary.paginator.firstPage();
        }
    }

    verDocumento(proyect) {
        console.log('SIiii', proyect);
        const dialogRef = this.dialog.open(DetallesDocumentoComponent, {
            data: proyect,
        });

        dialogRef.afterClosed().subscribe((result) => {});
    }

    visualizerPdf(file: any) {
        console.log('siii', file);

        this.pdfSrc = file.s31;
        this._changeDetectorRef.markForCheck();
    }

    download(file) {
        window.open(file.s31, '_blank');
    }
}
