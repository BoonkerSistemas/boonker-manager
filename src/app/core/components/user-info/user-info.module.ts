import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from './user-info.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SohoMatPopoverModule } from '../popover/popover.module';
import { RouterModule } from '@angular/router';
import {MatTooltipModule} from "@angular/material/tooltip";
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [UserInfoComponent],
    imports: [
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule,
        SohoMatPopoverModule,
        MatTooltipModule,
    ],
  exports: [UserInfoComponent],
})
export class UserInfoModule {}
