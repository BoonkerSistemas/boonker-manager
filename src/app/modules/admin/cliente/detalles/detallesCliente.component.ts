import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Subject} from 'rxjs';
import {AlertService} from 'app/services/alert.service';
import {MatPaginator} from "@angular/material/paginator";
import {QuillViewComponent} from "ngx-quill";
import {UserService} from "../../../../services/user/user.service";
import {ClientService} from "../../../../services/client/client.service";
import {UploadService} from "../../../../services/upload/upload.service";
import {FormGroup} from "@angular/forms";
import {HttpEventType, HttpResponse} from "@angular/common/http";



@Component({
    selector: 'app-detalles-cliente',
    templateUrl: './detallesCliente.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetallesClienteComponent implements OnInit, OnDestroy {
    data: any;
    dialogRef: MatDialogRef<any>;
    @ViewChild("paginator") paginator: MatPaginator;
    @ViewChild("editorText") editorText!: QuillViewComponent;

    estado: boolean = false;
    user: string = "";
    name: string = "";
    mail: string = "";
    tipo: any = [];

    edit = false;

    title = "Agregar";
    botton = "Guardar";

    crearProgramaFormGroup: FormGroup;
    progress = 0;
    imageUrlDesktop = "";
    message: any;

    previewMobil = "";
    preview = "";
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    rol: any[];
    lastName: any;
    locationUser: any;
    phone: any;
    phone2: any;
    mail2: any;
    ruc: any;
    selectedFiles?: FileList;
    currentFile?: File;
    urlImagen = "";

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private userService: ClientService,
        private readonly alertService: AlertService,
        private uploadService: UploadService,
        public dialogRef1: MatDialogRef<DetallesClienteComponent>,
        @Inject(MAT_DIALOG_DATA) public data1: any
    ) {
    }

    onNoClick(): void {
        this.dialogRef1.close();
    }

    ngOnInit(): void {
        console.log(this.data1)
        this.edit = this.data1 != "" && this.data1 != null;

        if (this.edit) {
            this.title = "Editar ";
            this.editarRegion(this.data1);
        }

    }


    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    guardarRegion() {
        if (this.edit) {
            let email = this.validateEmail(this.mail.toString());
            if (
                this.name.length === 0 ||
                this.mail.length === 0 ||
                this.tipo === "3" ||
                email === false ||
                this.tipo === "Selecciona un rol"
            ) {
                this.name = "";
                this.lastName = ''
                this.phone = "";
                this.phone2 = "";
                this.mail = "";
                this.mail2 = "";
                this.ruc = "";
                this.botton = "Guardar";
                this.title = "Agregar";
                this.alertService.mensajeError(
                    "No se guardo el registro, completa todos los datos"
                );
                this.onNoClick();
            } else {
                let edit = {
                    _id: this.id,
                    lastName: this.lastName,
                    name: this.name,
                    emailPersonal: this.mail,
                    emailWork: this.mail2,
                    phoneComercial: this.phone2,
                    phone: this.phone,
                    ruc: this.ruc,
                    rol: this.tipo,
                    active: this.estado,
                    picture: this.urlImagen

                };

                this.userService.updateOneById(edit).subscribe((data) => {

                    this.alertService.mensajeSuccess("Actualizado Correctamente");
                    this.ngOnInit();
                    this.name = "";
                    this.lastName = ''
                    this.phone = "";
                    this.phone2 = "";
                    this.mail = "";
                    this.mail2 = "";
                    this.ruc = "";
                    this.botton = "Guardar";
                    this.title = "Agregar";
                    this.dialogRef.afterClosed().subscribe((res) => {console.log(res)});
                });
                this.onNoClick();
            }

            this.edit = false;
        } else {
            let insert = {
                lastName: this.lastName,
                name: this.name,
                emailPersonal: this.mail,
                emailWork: this.mail2,
                phoneComercial: this.phone2,
                phone: this.phone,
                ruc: this.ruc,
                rol: this.tipo,
                active: this.estado,
                picture: this.urlImagen
            };
            let email = this.validateEmail(this.mail.toString());
            if (
                insert.name.length === 0 ||
                insert.emailPersonal.length === 0 ||
                insert.lastName.length === 0 ||
                insert.rol === "3" ||
                email === false ||
                insert.rol === "Selecciona un rol"
            ) {
                this.name = "";
                this.lastName = ''
                this.phone = "";
                this.phone2 = "";
                this.mail = "";
                this.mail2 = "";
                this.ruc = "";
                this.botton = "Guardar";
                this.title = "Agregar";
                this.alertService.mensajeError(
                    "No se guardo el registro, completa todos los datos"
                );
                this.onNoClick();
            } else {
                this.userService.create(insert).subscribe((data) => {
                    if (data.msm) {
                        this.alertService.mensajeError(data.msm ? data.msm : data.message);
                        this.onNoClick();
                    } else {
                        this.name = "";
                        this.lastName = ''
                        this.phone = "";
                        this.phone2 = "";
                        this.mail = "";
                        this.mail2 = "";
                        this.ruc = "";
                        this.botton = "Guardar";
                        this.alertService.mensajeSuccess("Guardado Correctamente");
                        this.onNoClick();
                    }
                    this.ngOnInit();

                    this.name = "";
                    this.lastName = ''
                    this.phone = "";
                    this.phone2 = "";
                    this.mail = "";
                    this.mail2 = "";
                    this.ruc = "";
                    this.botton = "Guardar";
                    this._changeDetectorRef.markForCheck();
                });
            }
        }
    }

    validateEmail(input: any) {
        const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return !!input.match(validRegex);
    }

    editarRegion(element) {

        this.title = "Editar";
        this.botton = "Actualizar";
        this.name = element.name;
        this.lastName = element.lastName
        this.phone = element.phone;
        this.locationUser = element.phone;
        this.phone2 = element.phoneComercial;
        this.mail = element.emailPersonal;
        this.mail2 = element.emailWork;
        this.ruc = element.ruc;
        this.botton = "Guardar";
        this.id = element._id;
    }


    checkCheckBoxvalue(event) {
        this.estado = event.checked;
    }



    selectFile(event: any): void {
        this.message = "";
        this.preview = "";
        this.progress = 0;
        this.selectedFiles = event.target.files;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.preview = "";
                this.currentFile = file;

                const reader = new FileReader();

                reader.onload = (e: any) => {
                    this.preview = e.target.result;
                    this.upload();
                };

                reader.readAsDataURL(this.currentFile);
            }
        }
    }


    upload(): void {
        this.progress = 0;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.currentFile = file;

                this.uploadService.upload(this.currentFile, this.name).subscribe({
                    next: (event: any) => {

                        console.log(event.body.acl);
                        this.urlImagen = event.body.acl;

                        if (event.type === HttpEventType.UploadProgress) {
                            this.progress = Math.round((100 * event.loaded) / event.total);
                        } else if (event instanceof HttpResponse) {
                            this.message = event.body.acl;
                            console.log(this.message);
                        }
                    },
                    error: (err: any) => {
                        console.log(err);
                        this.progress = 0;

                        if (err.error && err.error.message) {
                            this.message = err.error.message;
                        } else {
                            this.message = "Could not upload the image!";
                        }

                        this.currentFile = undefined;
                    },
                });
            }

            this.selectedFiles = undefined;
        }
    }



}
