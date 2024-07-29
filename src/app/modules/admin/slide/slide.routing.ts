import {Route} from "@angular/router";
import {SlideComponent} from "./slide.component";
import {CrearComponent} from "./crear/crear.component";
import {ListUploadComponent} from "./list-upload/list-upload.component";

export const slideRoutes: Route[] = [
    {
        path: "",
        component: SlideComponent,
    },
    {
        path: "new-project",
        component: CrearComponent,
    },
    {
        path: "new-project/:id",
        component: CrearComponent,
    },

];
