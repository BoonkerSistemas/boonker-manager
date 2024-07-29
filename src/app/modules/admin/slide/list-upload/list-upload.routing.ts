import { Route } from '@angular/router';
import {ListUploadComponent} from "./list-upload.component";
import {UploadFileComponent} from "../upload-file/upload-file.component";

export const fileRoutes: Route[] = [

    {
        path: '',
        pathMatch: 'full',
         component: ListUploadComponent,
    },
    {
        path: 'upload-file/:id',
        component: UploadFileComponent,
        children: [],
    },

];

