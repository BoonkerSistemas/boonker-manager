import { Route } from '@angular/router';
import {UploadFileComponent} from "./upload-file.component";

export const uploadRouter: Route[] = [

    {
        path: '',
        pathMatch: 'full',
         component: UploadFileComponent,
    },
    {
        path: 'upload-file/:id',
        component: UploadFileComponent,
        children: [],
    },

];

