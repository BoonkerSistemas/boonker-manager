import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';

import { SohoMatPopoverComponent } from './popover.component';

@NgModule({
  declarations: [SohoMatPopoverComponent],
  imports: [CommonModule, MatMenuModule],
  exports: [SohoMatPopoverComponent],
})
export class SohoMatPopoverModule {}
