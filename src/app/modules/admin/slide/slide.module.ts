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
import {CommonModule, DatePipe, NgIf} from "@angular/common";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {SlideComponent} from "./slide.component";
import {slideRoutes} from "./slide.routing";
import {CrearComponent} from "./crear/crear.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ActivosComponent} from "./activos/activos.component";
import {InactivosComponent} from "./inactivos/inactivos.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {ViewComponent} from "./activos/view/view.component";
import {ImagenComponent} from "./activos/imagen/imagen.component";
import {UploadFileComponent} from "./upload-file/upload-file.component";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
    declarations: [
        SlideComponent,
        CrearComponent,
        ActivosComponent,
        InactivosComponent,
        ViewComponent,
        ImagenComponent
    ],
    imports: [
        RouterModule.forChild(slideRoutes),
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
        MatCheckboxModule,
        MatFormFieldModule,
        MatButtonModule,
        NgIf,
        MatDialogModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatDatepickerModule,
        PdfViewerModule,
        MatProgressSpinnerModule,
    ],
    providers: [DatePipe],
})
export class SlideModule {
}
