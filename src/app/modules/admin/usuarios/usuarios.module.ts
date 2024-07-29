import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatRippleModule} from "@angular/material/core";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSortModule} from "@angular/material/sort";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {TranslocoModule} from "@ngneat/transloco";
import {NgApexchartsModule} from "ng-apexcharts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {valeElectronicoRoutes} from "./usuarios.routing";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {UsuariosComponent} from "./usuarios.component";
import {CrearUsuariosComponent} from "./crearUsuarios/crearUsuarios.component";
import {PipesModule} from "../../../pipe/pipe.module";

@NgModule({
    declarations: [UsuariosComponent, CrearUsuariosComponent],
    imports: [
        RouterModule.forChild(valeElectronicoRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatSelectModule,
        AutocompleteLibModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatTooltipModule,
        PipesModule,
        // SharedModule
    ],
})
export class UsuariosModule {
}
