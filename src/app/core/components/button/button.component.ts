import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() disabled: boolean = false;
  @Output() pulse = new EventEmitter<void>();

  _type: boolean = false;
  className = this._type
    ? 'mdc-button mdc-button--outlined mat-mdc-outlined-button mat-unthemed mat-mdc-button-base'
    : `mdc-button mdc-button--raised mat-mdc-raised-button bg-calypsotechy disabled:bg-black disabled:bg-opacity-12 disabled:text-black disabled:text-opacity-38
      flex flex-1 text-white mat-unthemed mat-mdc-button-base ng-star-inserted`;

  constructor() {}

  @Input() get stroked(): boolean {
    return this._type;
  }
  set stroked(name: boolean) {
    this._type = true;
    this.className =
      'mdc-button mdc-button--outlined mat-mdc-outlined-button mat-unthemed mat-mdc-button-base';
  }

  // eslint-disable-next-line
  @Input() get raised(): boolean {
    // eslint-disable-line
    return this._type;
  }
  set raised(name: boolean) {
    this._type = false;
    this.className = `mdc-button mdc-button--raised mat-mdc-raised-button bg-calypsotechy disabled:bg-black disabled:bg-opacity-12 disabled:text-black disabled:text-opacity-38
flex flex-1 text-white mat-unthemed mat-mdc-button-base ng-star-inserted`;
  }

  clickButton() {
    this.pulse.emit();
  }
}
