import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { ClienteComponent } from './cliente.component';
import {TableClienteComponent} from "./table-tthh/table-cliente.component";
import {DetallesClienteComponent} from "./detalles/detallesCliente.component";
import {FuseFindByKeyPipeModule} from "../../../../@fuse/pipes/find-by-key";
import {SharedModule} from "../../../shared/shared.module";
import {UserInfoModule} from "../../../core/components/user-info/user-info.module";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
const membersRoutes: Route[] = [
  {
    path: '',
    component: ClienteComponent,
  },
];

@NgModule({
    declarations: [ClienteComponent, TableClienteComponent, DetallesClienteComponent],
    imports: [
        CommonModule,
        MatIconModule,
        RouterModule.forChild(membersRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatLuxonDateModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSelectModule,
        MatTableModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        UserInfoModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatSortModule,
        AutocompleteLibModule
    ],
    exports: [

    ]
})
export class ClienteModule { }
