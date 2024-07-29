import { NgModule } from '@angular/core';
import { FuseFindByKeyPipe } from '@fuse/pipes/find-by-key/find-by-key.pipe';

@NgModule({
    declarations: [],
    imports: [
        FuseFindByKeyPipe
    ],
    exports: [
        FuseFindByKeyPipe
    ]
})
export class FuseFindByKeyPipeModule
{
}
