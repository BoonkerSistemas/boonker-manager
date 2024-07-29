import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {  Subject, takeUntil } from 'rxjs';
import { SlideService } from 'app/services/slide/slide.service';
import {UserService} from "../../../../core/user/user.service";
import {User} from "../../../../core/user/user.types";

@Component({
    selector: 'academy-list',
    templateUrl: './list.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademyListComponent implements OnInit, OnDestroy {
    //categories: Category[];
    courses: any[];
    filteredCourses: any[];
    namePerson;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _activosService: SlideService,
        private _userService: UserService,
    ) {}


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._userService.user$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: User) =>
            {
                this.namePerson = user;


                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        console.log('nombre usuario ',this.namePerson)

        this._activosService.findProject(this.namePerson.username).subscribe((data) => {
            console.log(data);
            // this.categories = data;
            this.courses = [data];
            this.filteredCourses = data;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });


    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
