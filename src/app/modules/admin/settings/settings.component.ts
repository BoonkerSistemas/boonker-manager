import {NgClass, NgFor, NgSwitch, NgSwitchCase} from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {Subject, takeUntil} from 'rxjs';
import {SettingsAccountComponent} from './account/account.component';
import {SettingsNotificationsComponent} from './notifications/notifications.component';
import {SettingsPlanBillingComponent} from './plan-billing/plan-billing.component';
import {SettingsSecurityComponent} from './security/security.component';
import {SettingsTeamComponent} from './team/team.component';
import {SettingsDetailsComponent} from "./details/details.component";
import {ActivatedRoute} from "@angular/router";
import {SlideService} from "../../../services/slide/slide.service";

@Component({
    selector: 'settings',
    templateUrl: './settings.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatSidenavModule, MatButtonModule, MatIconModule, NgFor, NgClass, NgSwitch, NgSwitchCase, SettingsDetailsComponent, SettingsAccountComponent, SettingsSecurityComponent, SettingsPlanBillingComponent, SettingsNotificationsComponent, SettingsTeamComponent],
})
export class SettingsComponent implements OnInit, OnDestroy {
    @ViewChild('drawer') drawer: MatDrawer;
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = true;
    panels: any[] = [];
    selectedPanel: string = 'details';
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    project ;
    idProject = "";

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private readonly activatedRouteService: ActivatedRoute,
        private _project: SlideService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Setup available panels

        this.activatedRouteService.params.subscribe(
            async (parametros) => {
                this.idProject = parametros.id;
            })

        this._project.findOneById(this.idProject).subscribe(response =>{
            console.log(response)
            this.project = response
        })


        this.panels = [
            {
                id: 'details',
                icon: 'heroicons_outline:user-circle',
                title: 'Información General',
                description: 'Visualiza los detalles de construcción de tu casa',
            },
            {
                id: 'account',
                icon: 'heroicons_outline:user-circle',
                title: 'Planos Arquitectónicos e Ingeniería Estructural',
                description: 'En este módulo Servicio al Cliente subirá la información referente a Arquitectura e Ingeniería Estructural del proyecto',
            },
            {
                id: 'security',
                icon: 'heroicons_outline:lock-closed',
                title: 'Ingenierías e Información Complementarias',
                description: 'En este módulo puedes cargar la información referente a renders, estudios de suelo, ingeniería hidrosanitaria y eléctrica, certificados de hormigones entre otros',
            },
            {
                id: 'plan-billing',
                icon: 'heroicons_outline:credit-card',
                title: 'Garantías',
                description: 'En ese módulo encontrarás el certificado de garantía de tu casa y el boonker book respectivo',
            },
            {
                id: 'notifications',
                icon: 'heroicons_outline:bell',
                title: 'Futuras modificaciones',
                description: 'Carga aqui los documentos referente a futuras ampliaciones',
            },

        ];

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('lg')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                } else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }

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
     * Navigate to the panel
     *
     * @param panel
     */
    goToPanel(panel: string): void {
        this.selectedPanel = panel;

        // Close the drawer on 'over' mode
        if (this.drawerMode === 'over') {
            this.drawer.close();
        }
    }

    /**
     * Get the details of the panel
     *
     * @param id
     */
    getPanelInfo(id: string): any {
        return this.panels.find(panel => panel.id === id);
    }

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
