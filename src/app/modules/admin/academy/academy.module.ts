import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    FuseFindByKeyPipe,
    FuseFindByKeyPipeModule,
} from '@fuse/pipes/find-by-key';
import { academyRoutes } from 'app/modules/admin/academy/academy.routing';
import { AcademyComponent } from 'app/modules/admin/academy/academy.component';
import { AcademyDetailsComponent } from 'app/modules/admin/academy/details/details.component';
import { AcademyListComponent } from 'app/modules/admin/academy/list/list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CarpetasComponent } from './carpetas/carpetas.component';
import { DetailsCarpetasComponent } from './carpetas/details/details.component';
import { VisitaObraComponent } from './visita-obra/visita-obra.component';
import { DetallesDocumentoComponent } from './visita-obra/detalles/detallesDocumento.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
    declarations: [
        AcademyComponent,
        AcademyDetailsComponent,
        AcademyListComponent,

        CarpetasComponent,
        DetailsCarpetasComponent,
        VisitaObraComponent,
        DetallesDocumentoComponent,
    ],
    imports: [
        RouterModule.forChild(academyRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,

        MatTabsModule,

        MatButtonToggleModule,
        MatDividerModule,
        MatMenuModule,
        MatRippleModule,
        MatSortModule,
        MatTableModule,
        NgApexchartsModule,
        TranslocoModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatCheckboxModule,
        NgIf,
        MatDialogModule,
        MatPaginatorModule,
        MatDatepickerModule,
        FuseFindByKeyPipe,
        PdfViewerModule,
    ],
    providers: [DatePipe],
})
export class AcademyModule {}
