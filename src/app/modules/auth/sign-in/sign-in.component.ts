import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { user as userData } from 'app/mock-api/common/user/data';
import axios from 'axios';
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        NgIf,
        NgFor,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    last_login: any = null;
    notForm: boolean = true;

    //
    id = 0
    clientTransactionId = ''

    arrayImages = [];
    private _user: any = userData;
    private rutaFull = ['/academy'];
    private rutaClient = ['/proyectos/full'];

    /**
     * Constructor
     */
    constructor(
        //private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private route: ActivatedRoute
    ) {
        let numbers: any = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
        ];
        //un array para guardar los 5 elementos aleatorios
        for (let i = 0; i < 12; i++) {
            //5: necesito 5 números
            let n = ~~(Math.random() * numbers.length);
            // ponlo en el nuevo array
            this.arrayImages.push(numbers[n]);
            // bórralo de numbers
            numbers.splice(numbers[n], 1);
        }
        console.log(this.arrayImages);

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', Validators.required],
        });
        this.route.queryParamMap.subscribe((params) => {
            this.clientTransactionId = params.get('clientTransactionId')
            this.id = +params.get('id')
            console.log('txId ', this.clientTransactionId)
            console.log('Id ', this.id)
            //const redirectURL = decodeURIComponent(params.get('redirectURL'));

        // const idMatch = redirectURL.match(/id=(\d+)/);
        // if (idMatch) {
        //     this.id = +idMatch[1]
        //     console.log('id ', this.id)
        // }
        });
        this.pagoConfirmado(this.id, this.clientTransactionId)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    random_text: string = 'Los mejores proyectos se construyen con Boonker';

    /**
     * Sign in
     */
    signIn(): void {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value).subscribe(
            async (estaAutenticado) => {
                if (estaAutenticado) {
                    if (this._authService.sessionDto) {
                        await this.llenarDatosUser();
                    }
                }
            },

            (response) => {
                // Re-enable the form
                this.signInForm.enable();

                // Reset the form
                this.signInNgForm.resetForm();

                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Credenciales incorrectas',
                };

                // Show the alert
                this.showAlert = true;
            }
        );
    }

    pagoConfirmado(id, clientTransactionId) {
        // const parametros = {
        //     id: this.id,
        //     clientTxId: this.clientTransactionId
        // }
        // this._authService.confirmarPago(parametros).subscribe(value => {
        //     console.log('datos confirmados ', value)
        // })
        //const axios = require('axios');
        let data = JSON.stringify({
        "id": id,
        "clientTxId": clientTransactionId
        });

        let config: any = {
        method: 'post',
        maxBodyLength: Infinity,
        url: environment.url+'/payphone/pago',
        headers: {
            'Authorization': 'Bearer e3KCtqwjcchjTx0OdIFKiwGCH9bEIpUnQfp8kvlD6vqeABD7x0jr9U31ktAJlc0_hMPExAm8yFjLHIenROq0vECP798oipnCI10lPu_h6H4W_hDTmWmqqG1CjHvnG0JWtvXWwF58Js9fmIU3jrufF1-PsLeAl16Twj2vHGRhEVziQr_f8duktzQxIpSv7kzNaYRRTX0utJ_RzCduAh3KKScD8n9ncI16Y5nqjZOQonIaMs0NqgbvGuFBxT3Rlx2AKs2iJ4HK_gY0-PxMf8_qLojmbMN7chiDOsDMRT9LTaA5kaUajc8f9BwUzk6gsHxnbuSrtfe27X_xgmiYQyrxtk09KC8',
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios.request(config)
        .then((response) => {

            const datosPago = {
                txId: response.data.transactionId
            }
            console.log(datosPago);
        })
        .catch((error) => {
        console.log(error);
        });

    }

    llenarDatosUser(): any {
        console.log(this._authService.sessionDto.user);

        this._user.email = this._authService.sessionDto.user.email;
        this._user.nombre = this._authService.sessionDto.user.nombre;
        this._user.nickname = this._authService.sessionDto.user.nickname;
        this._user.cedula = this._authService.sessionDto.user.cedula;
        this._user.avatar = this._authService.sessionDto.user.linkpicture;
        this._user.status = 'online';
        this._user.apellido = this._authService.sessionDto.user.apellido;
        this._user.numeroContacto =
            this._authService.sessionDto.user.numeroContacto;
        this._user.direccion = this._authService.sessionDto.user.direccion;
        this._user.fechaNacimiento =
            this._authService.sessionDto.user.fechaNacimiento;
        this._user.id = this._authService.sessionDto.user.id;
        if (this._authService.sessionDto.user.role === 'Cliente') {
            this._router.navigate(this.rutaClient);
        } else {
            this._router.navigate(this.rutaFull);
        }
    }
}
