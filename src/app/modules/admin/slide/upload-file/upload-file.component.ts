import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AlertService} from "../../../../services/alert.service";
import {MatDialog} from "@angular/material/dialog";
import {SlideService} from "../../../../services/slide/slide.service";
import {UploadService} from "../../../../services/upload/upload.service";
import {ClientService} from "../../../../services/client/client.service";
import {DateAdapter} from "@angular/material/core";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {DateFormat} from "../../../../../assets/date-format";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SharedModule} from "../../../../shared/shared.module";
import {MatInputModule} from "@angular/material/input";
import {MatCheckboxModule} from "@angular/material/checkbox";

/**
 * Class representing the UploadFileComponent.
 */
@Component({
    selector: 'app-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrl: './upload-file.component.scss',
})
export class UploadFileComponent implements OnInit {
    crearFormGroup: FormGroup;
    crearProgramaFormGroup: FormGroup;
    region: string;
    name: string;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = "";
    preview = "";
    urlImagen = "";
    idUsuario = "";
    user: any;
    tiempo: any = "";
    status: any = "";
    idEdit: any;
    editar = false;
    today: any;

    client: any[];
    clientRuc: any = "";
    dateFiles: any;


    constructor(
        private routerService: Router,
        private formBuilder: FormBuilder,
        private readonly alertService: AlertService,
        public dialog: MatDialog,
        private _activosService: SlideService,
        private uploadService: UploadService,
        private _activatedRoute: ActivatedRoute,
        private clientService: ClientService,
        private dateAdapter: DateAdapter<Date>
    ) {
        this.dateAdapter.setLocale("en-in"); // DD/MM/YYYY
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            console.log(params.get("id"));
            this.idEdit = params.get("id");
        });
        this.user = JSON.parse(localStorage.getItem("user"));
        console.log(this.user);
        this.idUsuario = this.user._id;
        this.getClient();
    }

    ngOnInit() {

        this.cargar();
        this.getClient();
        if (this.idEdit !== null) {
            this.editar = true;
            this.cargarDatos();
        }
    }

    getClient() {
        let clients = [];
        this.clientService.findAll().subscribe((data) => {
            data.forEach((item) => {
                console.log(item)
                if (item.active === true) {
                    clients.push(item);
                }
            });
            this.client = clients;
        });

    }

    cargar() {
        this.crearFormGroup = this.formBuilder.group({
            activo: new FormControl(false, Validators.required),
            tiempo: new FormControl("", Validators.required),
            titulo: new FormControl(""),
        });

    }

    cargarDatos() {
        this._activosService.findOneById(this.idEdit).subscribe((data: any) => {
            console.log(data)
            this.dateFiles = data
            this.crearFormGroup.get("activo").setValue(data.active);
            this.crearFormGroup.get("tiempo").setValue(data.type);
            this.crearFormGroup.get("titulo").setValue(data.description);

        });
    }

    /**
     * Function to handle the click event for the guardar button.
     *
     * @param {any} value - The value to be passed when the button is clicked.
     *
     * @return {void} - This method does not return anything.
     */
    onClickGuardar(value: any) {
        if (
            (this.crearFormGroup)
        ) {


            let insert: any = {

                active: value.activo,
                type: value.tiempo,
                file: this.urlImagen ? this.urlImagen : "defaul",
                description: value.titulo
            };


            if (insert.name === "") {
                if (insert.name === "") {
                    this.alertService.mensajeError("Completa toda la información");
                    Object.keys(this.crearFormGroup.controls).forEach((key) => {
                        this.crearFormGroup.controls[key].markAsTouched();
                    });
                    Object.keys(this.crearProgramaFormGroup.controls).forEach((key) => {
                        this.crearProgramaFormGroup.controls[key].markAsTouched();
                    });
                }

            } else {
                if (this.editar) {
                    console.log(insert);
                    insert._id = this.idEdit;

                    let aux
                    aux = this.dateFiles.documentationProject

                    aux.push(insert)

                    this.dateFiles.documentationProject = aux

                    console.log(insert)
                    delete this.dateFiles.ruc

                    this._activosService.updateOneById(this.dateFiles).subscribe((data) => {
                        this.alertService.mensajeSuccess("Actualizado Correctamente");
                        this.routerService.navigateByUrl("/projects");
                    });
                }
            }
        } else {
            Object.keys(this.crearFormGroup.controls).forEach((key) => {
                this.crearFormGroup.controls[key].markAsTouched();
            });

        }
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


    anterior() {
        this.routerService.navigateByUrl("/projects");
    }

    upload(): void {
        this.progress = 0;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.currentFile = file;

                this.uploadService.upload(this.currentFile, this.dateFiles.name).subscribe({
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

    getSelectedValue(event) {
        this.crearFormGroup.get("tiempo").setValue(event.value);
        this.tiempo = event.value;
    }

    getSelectedValue2(event) {
        this.crearFormGroup.get("status").setValue(event.value);
        this.status = event.value;
    }


    selectEvent(item) {
        console.log(item);
        this.clientRuc = item ? item : "";
        item.deselect();
    }

    onChangeSearch(val: string) {
        console.log(val);
    }

    onFocused(e) {
        console.log(e);
    }


}


