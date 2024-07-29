import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CdkScrollable} from "@angular/cdk/overlay";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UserService} from "../../../core/user/user.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {User} from "../../../core/user/user.types";
import {FuseAlertComponent, FuseAlertType} from "../../../../@fuse/components/alert";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {FormGroup, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {UploadService} from "../../../services/upload/upload.service";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {SlideService} from "../../../services/slide/slide.service";
import {ClientService} from "../../../services/client/client.service";

@Component({
    selector: 'app-endoso',
    standalone: true,
    imports: [CommonModule, CdkScrollable, MatButtonModule, MatIconModule, MatProgressBarModule, MatTooltipModule, FuseAlertComponent, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, ReactiveFormsModule],
    templateUrl: './endoso.component.html',
    styleUrl: './endoso.component.scss'
})
export class EndosoComponent implements OnInit {
    @ViewChild('comingSoonNgForm') comingSoonNgForm: NgForm;
    namePerson;
    crearProgramaFormGroup: FormGroup;
    region: string;
    name: string;

    selectedFiles?: FileList;
    currentFile?: File;
    progress = 0;
    message = "";
    preview = "";
    urlImagen = "";
    user: any;
    status: any = "";
    today: any;
    dataFlag
    src = ""


    private _unsubscribeAll: Subject<any> = new Subject<any>();


    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    comingSoonForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _userService: UserService,
        private uploadService: UploadService,
        private _project: SlideService,
        private _createUser: ClientService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    flag = false;
    document

    /**
     * On init
     */
    ngOnInit(): void {

        this._project.findOneDocument("65d0d95cc6792b0214292e13", 'Garantias').subscribe((data: any) => {
            this.document = data.documentationProject
            data.forEach((item) => {
                if (item.active === true) {
                    this.dataFlag = item
                }
            })
            this.src = this.dataFlag.file

        })

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.namePerson = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Create the form
        this.comingSoonForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            ruc: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
        });
    }

    guardarRegion() {

        let insert = {
            lastName: this.comingSoonForm.value.lastName,
            name: this.comingSoonForm.value.name,
            emailPersonal: this.comingSoonForm.value.email,
            emailWork: this.comingSoonForm.value.email,
            phoneComercial: "123456789",
            phone: "123456789",
            ruc: this.comingSoonForm.value.ruc,
            rol: "",
            active: true,
            picture: this.urlImagen
        };
        let email = this.validateEmail(this.comingSoonForm.value.email.toString());
        if (
            insert.name.length === 0 ||
            insert.emailPersonal.length === 0 ||
            insert.lastName.length === 0 ||
            insert.rol === "3" ||
            email === false ||
            insert.rol === "Selecciona un rol"
        ) {

        } else {
            this._createUser.createClient(insert).subscribe((data) => {
                this.flag = true
                if (data.msm) {

                } else {

                }
                this.ngOnInit();
                this._changeDetectorRef.markForCheck();
            });

        }
    }

    validateEmail(input: any) {
        const validRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return !!input.match(validRegex);
    }

    register(): void {

        this.guardarRegion()
        // Return if the form is invalid
        if (this.comingSoonForm.invalid) {
            return;
        }

        // Disable the form
        this.comingSoonForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Do your action here...
        // Emulate server delay
        setTimeout(() => {
            // Re-enable the form
            this.comingSoonForm.enable();

            // Reset the form
            this.comingSoonNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'success',
                message: 'You have been registered to the list.',
            };

        }, 1000);
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


    saveUpload() {
        this.dataFlag

        console.log(this.dataFlag)
        let aux
        aux = this.document.filter((item: any) => item.file === this.dataFlag.file)
        this.document = aux


        this.dataFlag.document = this.document

        this._project.updateOneById(this.dataFlag).subscribe((data) => {

        });
    }


    upload(): void {
        this.progress = 0;

        if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);

            if (file) {
                this.currentFile = file;

                this.uploadService.upload(this.currentFile, 'k').subscribe({
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
