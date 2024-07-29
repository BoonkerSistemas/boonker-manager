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
import {Observable, Subject} from "rxjs";
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogRef,
} from "@angular/material/dialog";
import {fuseAnimations} from "@fuse/animations";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {QuillViewComponent} from "ngx-quill";
import {UserService} from "../../../../services/user/user.service";
import {RolesService} from "../../../../services/roles/roles.service";
import {AlertService} from "../../../../services/alert.service";
import * as CryptoJS from "crypto-js";
import {environment} from "../../../../../environments/environment";
import Swal from "sweetalert2";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {FormGroup} from "@angular/forms";
import {UploadService} from "../../../../services/upload/upload.service";

@Component({
    selector: "crearCalificacion",
    templateUrl: "./crearUsuarios.component.html",
    styleUrls: ["./crearUsuarios.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrearUsuariosComponent implements OnInit, OnDestroy {
    data: any;
    dialogRef: MatDialogRef<any>;
    @ViewChild("paginator") paginator: MatPaginator;
    @ViewChild("editorText") editorText!: QuillViewComponent;
    calificaciones: any[] = [];
    budgetDetails: any = {
        columns: ["name", "user", "role", "status", "accion"],
    };
    estado: boolean = false;
    rowDetails: any = [];
    user: string = "";
    name: string = "";
    mail: string = "";
    tipo: any = [];
    editRegion: any = [];
    edit = false;
    dataregiones = [];
    title = "Agregar";
    botton = "Guardar";
    keyword = "role";

    progress = 0;
    imageUrlDesktop = "";
    message: any;

    previewMobil = "";
    preview = "";
    id: any;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    rol: any[];


    crearProgramaFormGroup: FormGroup;

    selectedFiles?: FileList;
    currentFile?: File;
    urlImagen = "";


    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private userService: UserService,
        private rolService: RolesService,
        private readonly alertService: AlertService,
        private uploadService: UploadService,
        public dialogRef1: MatDialogRef<CrearUsuariosComponent>,
        @Inject(MAT_DIALOG_DATA) public data1: any
    ) {
        this.getRoles();
    }

    onNoClick(): void {
        this.dialogRef1.close();
    }

    ngOnInit(): void {
        this.edit = this.data1 != "";

        if (this.edit) {
            this.title = "Editar ";
            this.editarRegion(this.data1);
        }

        this.getRegiones();
        this.getRoles();
    }

    getRegiones() {
        this.userService.findAll().subscribe((data) => {
            this.dataregiones = data;
            this.rowDetails = new MatTableDataSource(data);
            this.rowDetails.paginator = this.paginator;
            this._changeDetectorRef.markForCheck();
        });
    }

    getRoles() {
        let roles = [];
        this.rolService.findAll().subscribe((data) => {
            data.forEach((item) => {
                if (item.active === true) {
                    roles.push(item);
                }
            });
            this.rol = roles;
        });

        // this.rol = this.rol.filter(data=> {data.active === true})
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
                this.user = "";
                this.mail = "";
                this.preview = "";
                this.tipo = "Selecciona un rol";
                this.previewMobil = "";
                this.botton = "Guardar";
                this.title = "Agregar";
                this.alertService.mensajeError(
                    "No se guardo el registro, completa todos los datos"
                );
                this.onNoClick();
            } else {
                let edit = {
                    _id: this.id,
                    username: this.user,
                    name: this.name,
                    email: this.mail,
                    rol: this.tipo,
                    status: this.estado,
                    statusGeneral: true,
                };

                this.userService.updateOneById(edit).subscribe((data) => {
                    this.alertService.mensajeSuccess("Actualizado Correctamente");
                    this.ngOnInit();
                    this.name = "";
                    this.user = "";
                    this.mail = "";
                    this.preview = "";
                    this.tipo = "Selecciona un rol";
                    this.estado = false;
                    this.botton = "Guardar";
                    this.title = "Agregar";
                    this.dialogRef.afterClosed().subscribe((res) => {
                    });
                });
                this.onNoClick();
            }

            this.edit = false;
        } else {
            let insert = {
                username: this.user,
                name: this.name,
                email: this.mail,
                rol: this.tipo,
                password: CryptoJS.AES.encrypt(
                    this.autoCreate(),
                    environment.keyEncrypt
                ).toString(),
                status: this.estado,
                statusGeneral: true,
                userVerified: false,
                picture: this.imageUrlDesktop
            };
            let email = this.validateEmail(this.mail.toString());
            if (
                insert.username.length === 0 ||
                insert.email.length === 0 ||
                insert.name.length === 0 ||
                insert.rol === "3" ||
                email === false ||
                insert.rol === "Selecciona un rol"
            ) {
                this.name = "";
                this.user = "";
                this.mail = "";
                this.preview = "";
                this.tipo = "Selecciona un rol";
                this.previewMobil = "";
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
                        this.user = "";
                        this.mail = "";
                        this.preview = "";
                        this.tipo = "Selecciona un rol";
                        this.preview = "";
                        this.previewMobil = "";
                        this.preview = "";
                        this.previewMobil = "";
                        this.alertService.mensajeSuccess("Guardado Correctamente");
                        this.onNoClick();
                    }
                    this.ngOnInit();

                    this.name = "";
                    this.user = "";
                    this.mail = "";
                    this.preview = "";
                    this.tipo = "Selecciona un rol";
                    this.previewMobil = "";
                    this._changeDetectorRef.markForCheck();
                });
            }
        }
    }

    validateEmail(input: any) {
        const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (input.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }

    editarRegion(element) {
        console.log(element);
        this.title = "Editar";
        this.botton = "Actualizar";
        this.name = element.name;
        this.user = element.username;
        this.mail = element.email;
        this.tipo = element.rol[0];
        this.estado = element.status;
        this.edit = true;
        this.id = element._id;
        this.imageUrlDesktop = element.preview
        this.preview = element.preview
    }

    eliminarRegion(element) {
        Swal.fire({
            title: "¿Deseas eliminar este campo?",

            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, quiero eliminar!",
            cancelButtonText: "Cancelar!",
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(element);

                let edit = {
                    _id: element._id,
                    statusGeneral: false,
                };

                this.userService.updateOneById(edit).subscribe((data) => {
                    console.log(data);
                    this.alertService.mensajeSuccess("Eliminado Correctamente");
                    this.ngOnInit();
                    this.name = "";
                    this.user = "";
                    this.mail = "";
                    this.preview = "";
                    this.tipo = "Selecciona un rol";
                    this.estado = false;
                    this.botton = "Guardar";
                    this.title = "Agregar";
                    this.dialogRef.afterClosed().subscribe((res) => {
                    });
                });
            }
        });
    }

    cerrar() {
        this.edit = false;
        this.name = "";
        this.user = "";
        this.mail = "";
        this.preview = "";
        this.tipo = "Selecciona un rol";
        this.previewMobil = "";
        this.title = "Agregar";
        this.botton = "Guardar";
    }

    checkCheckBoxvalue(event) {
        this.estado = event.checked;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.rowDetails.filter = filterValue.trim().toLowerCase();
        if (this.rowDetails.paginator) {
            this.rowDetails.paginator.firstPage();
        }
    }

    checkCheckBoxvalueId(event, val) {
        this.id = val._id;
        this.estado = event.checked;

        let update = {
            _id: this.id,
            message: event.message,
            imageUrlDesktop: event.imageUrlDesktop,
            imageUrlMobile: event.imageUrlMobile,
            active: this.estado,
        };
        this.userService.updateOneById(update).subscribe((data) => {
            console.log(data);
            this.alertService.mensajeSuccess("Actualizado Correctamente");
            this.getRegiones();

            this.botton = "Guardar";
            this.title = "Agregar";
            this._changeDetectorRef.markForCheck();
        });
    }

    getSelectedValue(item) {
        let val = [];
        let ids = item.target.value;

        this.rol.forEach((value) => {
            if (value._id === ids) {
                val = value;
            }
        });
        this.tipo = val;

        console.log(val);
    }

    autoCreate() {
        const chars =
            "$%&/!abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }

    selectEvent(item) {
        console.log(item);
        this.tipo = item ? item : "";
        item.deselect();
    }

    onChangeSearch(val: string) {
        console.log(val);
    }

    onFocused(e) {
        console.log(e);
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

                        console.log(event);
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
