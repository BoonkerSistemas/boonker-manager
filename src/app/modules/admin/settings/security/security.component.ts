import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgForOf, NgIf } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SlideService } from '../../../../services/slide/slide.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { UploadService } from 'app/services/upload/upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ClientService } from 'app/services/client/client.service';
import { AlertService } from 'app/services/alert.service';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    styleUrl: './security.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
        NgForOf,
        NgIf,
        PdfViewerModule,
        MatTooltipModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    @ViewChild('myInput') myInputVariable: ElementRef;
    items: any;

    @Input()
    projectDos: any;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = '';
    preview = '';

    idEdit: any;
    editar = false;
    user: any;
    idUsuario = '';
    client: any[];
    clientRuc: any = '';
    dateFiles: any;
    urlImagen = '';
    descripcionDocumento = '';
    /**
     * Constructor
     */
    constructor(
        private _project: SlideService,
        private uploadService: UploadService,
        private _activatedRoute: ActivatedRoute,
        private clientService: ClientService,
        private _activosService: SlideService,
        private readonly alertService: AlertService,
        private routerService: Router
    ) {
        this._activatedRoute.paramMap.subscribe((params: ParamMap) => {
            console.log(params.get('id'));
            this.idEdit = params.get('id');
        });
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(this.user);
        this.idUsuario = this.user._id;
        this.getClient();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    pdfSrc;

    responseFiles = [];

    /**
     * On init
     */
    ngOnInit(): void {
        console.log(this.projectDos);
        this._project
            .findOneDocument(this.projectDos._id, 'Ingenierías complementarias')
            .subscribe((data) => {
                console.log(data);
                if (data) {
                    console.log(data);
                    data.forEach((val, index) => {
                        let name =
                            val.file.split('/')[val.file.split('/').length - 1];
                        let item = {
                            id: index,
                            folderId: index,
                            name: name,
                            createdBy: '',
                            createdAt: '',
                            modifiedAt: '',
                            size: val.file,
                            type: name.split('.')[1],
                            contents: val.description,
                            description: val.type,
                        };
                        console.log(item);
                        this.responseFiles.push(item);
                    });

                    let itemsData = { folders: [], files: [], path: [] };

                    itemsData = {
                        //folders: folders,
                        folders: [],
                        files: this.responseFiles,
                        path: [],
                    };
                    console.log(itemsData);

                    this.items = itemsData;
                }
            });
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
                console.log(item);
                if (item.active === true) {
                    clients.push(item);
                }
            });
            this.client = clients;
        });
    }

    cargarDatos() {
        this._activosService.findOneById(this.idEdit).subscribe((data: any) => {
            console.log('Aquiiiiiii', data);
            this.dateFiles = data;
        });
    }

    visualizerPdf(file: any) {
        this.pdfSrc = file.size;
    }

    download(file) {
        window.open(file.size, '_blank');
    }
    /* Carga DOcumentos */
    selectFile(event: any): void {
        this.message = '';
        this.preview = '';
        this.progress = 0;
        this.selectedFiles = event.target.files;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.preview = '';
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
                console.log('GUARDAR ARCHIVO DESCOMENTAR');
                this.addDescripcionFIle();
            }

            this.selectedFiles = undefined;
        }
    }

    addDescripcionFIle() {
        Swal.fire({
            title: 'Ingrese Descripcion de Documento',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(result.value);
                this.descripcionDocumento = result.value;
                this.uploadService
                    .upload(this.currentFile, this.dateFiles.name)
                    .subscribe({
                        next: (event: any) => {
                            console.log(event);
                            this.urlImagen = event.body.acl;
                            this.actualizarDocumentos();
                            if (event.type === HttpEventType.UploadProgress) {
                                this.progress = Math.round(
                                    (100 * event.loaded) / event.total
                                );
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
                                this.message = 'Could not upload the image!';
                            }

                            this.currentFile = undefined;
                        },
                    });
            }
            if (result.isDismissed) {
                this.myInputVariable.nativeElement.value = '';
            }
        });
    }

    actualizarDocumentos() {
        let insert: any = {
            active: true,
            type: 'Ingenierías complementarias',
            file: this.urlImagen ? this.urlImagen : 'defaul',
            description: this.descripcionDocumento,
        };
        if (this.editar) {
            console.log(insert);
            insert._id = this.idEdit;

            let aux;
            aux = this.dateFiles.documentationProject;

            aux.push(insert);

            this.dateFiles.documentationProject = aux;

            console.log(insert);
            delete this.dateFiles.ruc;

            this._activosService
                .updateOneById(this.dateFiles)
                .subscribe((data) => {
                    this.alertService.mensajeSuccess(
                        'Actualizado Correctamente'
                    );
                    this.routerService.navigateByUrl(
                        '/setting/' + this.dateFiles._id
                    );
                });
        }
    }
}
