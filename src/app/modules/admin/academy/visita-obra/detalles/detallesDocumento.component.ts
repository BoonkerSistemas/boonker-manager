import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { AlertService } from 'app/services/alert.service';

@Component({
    selector: 'app-detalles-documento',
    templateUrl: './detallesDocumento.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallesDocumentoComponent implements OnInit, OnDestroy {
    dialogRef: MatDialogRef<any>;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    pdfSrc;
    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly alertService: AlertService,
        public dialogRef1: MatDialogRef<DetallesDocumentoComponent>,
        @Inject(MAT_DIALOG_DATA) public data1: any
    ) {}

    onNoClick(): void {
        this.dialogRef1.close();
    }

    ngOnInit(): void {
        console.log(this.data1);
        this.pdfSrc = this.data1.s31;
        //this.edit = this.data1 != "" && this.data1 != null;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
