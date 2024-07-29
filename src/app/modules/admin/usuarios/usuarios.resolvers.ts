import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,} from "@angular/router";
import {Observable} from "rxjs";
import {UsuariosService} from "./usuarios.service";

@Injectable({
    providedIn: "root",
})
export class UsuariosResolvers implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _projectService: UsuariosService) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<any> {
        return this._projectService.getData();
    }
}
