import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableClienteComponent } from './table-cliente.component';
import {MatIconModule} from "@angular/material/icon";
import {UserInfoModule} from "../../../../core/components/user-info/user-info.module";
import {RouterLink} from "@angular/router";



@NgModule({
  declarations: [
    TableClienteComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        UserInfoModule,
        RouterLink
    ]
})
export class TableClienteModule { }
