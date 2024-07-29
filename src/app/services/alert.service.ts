/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/naming-convention */
import {Injectable} from '@angular/core';
import Swal, {SweetAlertResult} from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor() {//constructor
    }

    mensajeError(textoError: string) {
        return Swal.fire({
            icon: 'error',
            title: 'Error',
            text: textoError,
        });
    }

    mensajeSuccess(textoSuccess: string) {
        return Swal.fire({
            icon: 'success',
            title: 'Correcto',
            text: textoSuccess,
        });
    }

    mensajeInfo(textoInfo: string) {
        return Swal.fire({
            icon: 'info',
            title: 'Información',
            text: textoInfo,
        });
    }

    logInSuccess(textoSuccess: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,

        });

        return Toast.fire({
            icon: 'success',
            title: textoSuccess
        });
    }

    toastSuccess(textoSuccess: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,

        });

        return Toast.fire({
            icon: 'success',
            title: textoSuccess
        });
    }

    toastInfo(textoSuccess: string) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,

        });

        return Toast.fire({
            icon: 'info',
            title: textoSuccess
        });
    }

    mensajeConfirmacion(mensaje: string): Promise<SweetAlertResult> {
        return Swal.fire({
            title: 'Mensaje de confirmación',
            text: mensaje,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí'
        });
    }
}
