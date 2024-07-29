/* eslint-disable @typescript-eslint/member-ordering, radix,@typescript-eslint/semi, @typescript-eslint/no-shadow,@typescript-eslint/explicit-function-return-type*/
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators,} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AlertService} from "app/services/alert.service";
import {SlideService} from "../../../../services/slide/slide.service";
import {Observable} from "rxjs";
import {UploadService} from "../../../../services/upload/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {DateAdapter} from "@angular/material/core";
import {DateFormat} from "../../../../../assets/date-format";
import {ClientService} from "../../../../services/client/client.service";

@Component({
    selector: "app-crear",
    templateUrl: "./crear.component.html",
    styleUrls: ["./crear.component.scss"],
    providers: [{provide: DateAdapter, useClass: DateFormat}],
})
export class CrearComponent implements OnInit {
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
    imageInfos?: Observable<any>;
    tiempo: any = "";
    status: any = "";
    idEdit: any;
    editar = false;
    today: any;
    todayNew: any;


    previewMobil = "";

    keyword = "ruc";
    client: any[];
    clientRuc: any= "";


    constructor(
        private routerService: Router,
        private formBuilder: FormBuilder,
        private readonly alertService: AlertService,
        public dialog: MatDialog,
        private _activosService: SlideService,
        private uploadService: UploadService,
        private datePipe: DatePipe,
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
        const datePite = new DatePipe("en-Us");
        this.today = datePite.transform(new Date(), "yyyy-MM-dd");
        const datePiteN = new DatePipe("en-Us");
        let date = new Date();
        this.todayNew = datePiteN.transform(
            new Date().setDate(date.getDate() + 1),
            "yyyy-MM-dd"
        );

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

        // this.rol = this.rol.filter(data=> {data.active === true})
    }
    cargar() {
        this.crearFormGroup = this.formBuilder.group({
            titulo: new FormControl("", Validators.required),
            activo: new FormControl(false, Validators.required),
            tiempo: new FormControl("", Validators.required),
            location: new FormControl("", Validators.required),
            m2: new FormControl("", Validators.required),
            modules: new FormControl("", Validators.required),
            observation: new FormControl("", ),
            personResponsible: new FormControl(""),
            status: new FormControl("", Validators.required),
            fechaInicio: new FormControl(""),
        });

    }
    cargarDatos() {
        this._activosService.findOneById(this.idEdit).subscribe((data: any) => {
            console.log(data);
            this.crearFormGroup.get("titulo").setValue(data.name);
            this.name = data.name
            this.crearFormGroup.get("activo").setValue(data.active);
            this.crearFormGroup.get("tiempo").setValue(data.type);
            this.tiempo = data.type;
            this.crearFormGroup.get("location").setValue(data.location);
            this.crearFormGroup.get("m2").setValue(data.m2);
            this.crearFormGroup.get("modules").setValue(data.modules);
            this.crearFormGroup.get("observation").setValue(data.observation);
            this.crearFormGroup.get("personResponsible").setValue(data.personResponsible);
            this.crearFormGroup.get("status").setValue(data.status);
            this.urlImagen = data.imageUrlDesktop;
            this.preview = data.imageUrlDesktop;
            this.previewMobil = data.imageUrlMobile;
            this.crearFormGroup.get("fechaInicio").setValue(data.startDate);
            this.clientRuc = data.ruc;
        });
    }

    onClickGuardar(value: any) {
        if (
            (this.crearFormGroup )
        ) {

            console.log(value)

            let insert: any = {

                name: value.titulo,
                active: value.activo,
                type: value.tiempo,
                location: value.location,
                m2: parseInt(value.m2),
                modules: parseInt(value.modules),
                observation: value.observation,
                personResponsible: [value.personResponsible],
                status: value.status,
                startDate: this.datePipe
                    .transform(
                        new Date(this.crearFormGroup.value.fechaInicio),
                        "yyyy-MM-dd 08:00"
                    )
                    .toString(),
                picture: this.urlImagen ? this.urlImagen : "defaul",
                createdUserId: this.idUsuario,
                targetUrl: "",
                ruc: this.clientRuc.ruc
            };
            console.log("Insertar", insert);

            if (
                insert.name === ""
            ) {
                if (
                    insert.name === ""
                ) {
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
                    this._activosService.updateOneById(insert).subscribe((data) => {
                        this.alertService.mensajeSuccess("Actualizado Correctamente");
                        this.routerService.navigateByUrl("/projects");
                    });
                } else {
                    this._activosService.create(insert).subscribe((data) => {
                        this.alertService.mensajeSuccess("Guardado Correctamente");
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
        this.routerService.navigateByUrl("/slides");
    }

    upload(): void {
        this.progress = 0;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.currentFile = file;

                this.uploadService.upload(this.currentFile,this.name).subscribe({
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
