import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FuseMasonryComponent} from "./masonry.component";

@NgModule({

    imports: [
        CommonModule,
        FuseMasonryComponent
    ],
    exports     : [
        FuseMasonryComponent
    ]
})
export class FuseMasonryModule
{
}
