import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot,} from "@angular/router";
import {Observable} from "rxjs";
import {RolesService} from "../../../services/roles/roles.service";

@Injectable({
    providedIn: "root",
})
export class RolesResolvers implements Resolve<any> {
    /**
     * Constructor
     */
    constructor(private _projectService: RolesService) {
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
        return this._projectService.findAll();
    }
}
