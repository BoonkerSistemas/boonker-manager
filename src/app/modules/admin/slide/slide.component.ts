import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation,} from "@angular/core";
import {Subject} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {fuseAnimations} from "@fuse/animations";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Router} from "@angular/router";

@Component({
    selector: "slide",
    templateUrl: "./slide.component.html",
    styleUrls: ["./slide.component.scss"],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit, OnDestroy {
    data: MatTableDataSource<any>;
    displayedColumns: string[] = [
        "titulo",
        "autor",
        "fecha",
        "curso",
        "tiempo",
        "accion",
    ];
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(public dialog: MatDialog, private routerService: Router) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.cargarDatos();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    cargarDatos() {
        let value = [
            {
                titulo: "a",
                autor: "a",
                fecha: "",
                curso: "a",
                tiempo: "a",
            },
            {
                titulo: "b",
                autor: "b",
                fecha: "",
                curso: "b",
                tiempo: "b",
            },
        ];
        this.data = new MatTableDataSource(value);
        this.data.paginator = this.paginator;
        this.data.sort = this.sort;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.data.filter = filterValue.trim().toLowerCase();
        if (this.data.paginator) {
            this.data.paginator.firstPage();
        }
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    nuevo(): void {
        this.routerService.navigateByUrl("/projects/new-project");
    }
}
