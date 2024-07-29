import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '../../../pipe/pipe.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuillViewComponent } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { User } from '../../../core/user/user.types';
import { SlideService } from '../../../services/slide/slide.service';
import { UserService } from '../../../core/user/user.service';
import { UnitsService } from '../../../services/units/units.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cliente-despachos',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        MatTooltipModule,
        PipesModule,
    ],
    templateUrl: './cliente-despachos.component.html',
    styleUrl: './cliente-despachos.component.scss',
})
export class ClienteDespachosComponent implements OnInit {
    data: any;
    dialogRef: MatDialogRef<any>;
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('editorText') editorText!: QuillViewComponent;
    budgetDetails: any = {
        columns: ['name', 'user', 'status', 'accion'],
    };
    estado: boolean = false;
    rowDetails: any = [];
    user: string = '';
    name: string = '';
    mail: string = '';
    tipo: any = [];
    edit = false;
    title = 'Agregar';
    botton = 'Guardar';

    progress = 0;
    imageUrlDesktop = '';
    message: any;

    previewMobil = '';
    preview = '';
    id: any;
    rol: any[];

    courses: any[];
    filteredCourses: any[];
    namePerson;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private _changeDetectorRef: ChangeDetectorRef,
        private readonly alertService: AlertService,
        private _activosService: SlideService,
        private _userService: UserService,
        private _unitService: UnitsService,
        private routerService: Router
    ) {}

    ngOnInit(): void {
        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) => {
                this.namePerson = user;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        console.log(this.namePerson);

        this._activosService
            .findProject(this.namePerson.username)
            .subscribe((data) => {
                console.log(data);
                // this.categories = data;
                this.courses = [data];

                this.rowDetails = new MatTableDataSource(data);
                this.rowDetails.paginator = this.paginator;
                this._changeDetectorRef.markForCheck();

                this.filteredCourses = data;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
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

    validateEmail(input: any) {
        const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (input.match(validRegex)) {
            return true;
        } else {
            return false;
        }
    }

    editarRegion(element) {
        Swal.fire({
            title: 'Agregar unidades',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off',
            },
            showCancelButton: true,
            confirmButtonText: 'Agregar',
            showLoaderOnConfirm: true,
            preConfirm: async (login) => {
                try {
                    let number = parseInt(login.toString());
                    for (let i = 0; i < number; i++) {
                        let unit = {
                            project: element._id,
                            customer: element.ruc,
                            customerHistory: [],
                            observation: '',
                            documentationProject: [],
                            status: element.status,
                            active: true,
                            picture: element.url,
                        };
                        this._unitService.create(unit).subscribe((data) => {
                            console.log(data);
                        });
                    }

                    /*   const githubUrl = `
        https://api.github.com/users/${login}
      `;
                    const response = await fetch(githubUrl);
                    if (!response.ok) {
                        return Swal.showValidationMessage(`
          ${JSON.stringify(await response.json())}
        `);
                    }
                    return response.json();*/
                } catch (error) {
                    Swal.showValidationMessage(`
        Request failed: ${error}
      `);
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${result.value.login}'s avatar`,
                    imageUrl: result.value.avatar_url,
                });
            }
        });
    }

    agregarUnidades(element) {}

    cerrar() {
        this.edit = false;
        this.name = '';
        this.user = '';
        this.mail = '';
        this.preview = '';
        this.tipo = 'Selecciona un rol';
        this.previewMobil = '';
        this.title = 'Agregar';
        this.botton = 'Guardar';
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

    autoCreate() {
        const chars =
            '$%&/!abcdefghijklmnopqrstubwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }

    selectEvent(item) {
        console.log(item);
        this.tipo = item ? item : '';
        item.deselect();
    }

    onChangeSearch(val: string) {
        console.log(val);
    }

    onFocused(e) {
        console.log(e);
    }

    generarDespachos(data) {
        console.log('DATTTAAA', data);
        this.routerService.navigateByUrl(
            '/cliente-despachos/lista/' + data._id
        );
    }
}
