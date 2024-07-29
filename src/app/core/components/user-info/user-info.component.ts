import { lastValueFrom, take } from 'rxjs';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SohoMatPopoverComponent } from '../popover/popover.component';
import {ColaboradoresService} from "../../../services/colaboradores.service";

@Component({
  selector: 'user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  exportAs: 'user-info',
})
export class UserInfoComponent implements OnInit {
  @Input() name: string = null;
  @Input() avatar: string | null = null;
  @Input() accountId: string | null = null;
  @Input() jiraMode: boolean = false;
  @Input() code: string = ''; //Esto solo funciona si se conoce el área de antemano

  isLoading: boolean = true;
  dataLoaded: boolean = false;
  userData: any | null = false;
  userImgUrl: string | null = null;
  userProfileUrl: string | null = null;
  userArea: any | null = null;
  sohoPopoverColor: string = 'soho-popover-default';
  backgroundClass: string = 'user-info-bg-default';

  @ViewChild('popover', { static: true }) popover: SohoMatPopoverComponent;

  constructor(
    private _router: Router,
    private _employeeService: ColaboradoresService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.init().then();
    switch (this.code) {
      case 'PPL': {
        this.backgroundClass = 'user-info-bg-red';
        this.sohoPopoverColor = 'soho-popover-red';
        break;
      }
      case 'PMO': {
        this.backgroundClass = 'user-info-bg-green';
        this.sohoPopoverColor = 'soho-popover-green';
        break;
      }
      case 'TI': {
        this.backgroundClass = 'user-info-bg-blue';
        this.sohoPopoverColor = 'soho-popover-blue';
        break;
      }
      case 'DN': {
        this.backgroundClass = 'user-info-bg-lemon';
        this.sohoPopoverColor = 'soho-popover-lemon';
        break;
      }
      case 'GRW': {
        this.backgroundClass = 'user-info-bg-brown';
        this.sohoPopoverColor = 'soho-popover-brown';
        break;
      }
      default: {
        this.backgroundClass = 'user-info-bg-default';
        this.sohoPopoverColor = 'soho-popover-default';
      }
    }
  }

  async init(): Promise<void> {
    this.isLoading = true;
    let area = null;
    if (this.jiraMode) {
      const data: any = await lastValueFrom(
        this._employeeService.getColaborador(this.accountId).pipe(take(1))
      );
      if (data) {
        this.userData = data.Item;
        this.isLoading = false;
        this.dataLoaded = true;
        this.userImgUrl = this.userData.linkpicture;
        this.userProfileUrl = `/profile/${this.userData?.id}`;
        this.userArea =
          this.userData?.employee_profile_set[0]?.profile?.department;
        area = this.userArea;
      }
    } else {
      const data: any = await lastValueFrom(
        this._employeeService.getColaborador(this.accountId).pipe(take(1))
      );
      if (data) {
        this.userData = data.Item;
        this.isLoading = false;
        this.dataLoaded = true;
        this.userImgUrl = this.userData.linkpicture;
        this.userProfileUrl = `/profile/${this.userData?.id}`;
        this.userArea =
         " this.userData?.employee_profile_set[0]?.profile?.department";
        area = this.userArea;
      }
    }
  }
}
