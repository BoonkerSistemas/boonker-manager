import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  MatMenuTrigger,
  MenuPositionX,
  MenuPositionY,
} from '@angular/material/menu';

@Component({
  selector: 'soho-popover',
  templateUrl: './popover.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./popover.component.scss'],
  exportAs: 'sohoMatPopover',
})
export class SohoMatPopoverComponent {
  @Input() xPosition: MenuPositionX = 'after';
  @Input() yPosition: MenuPositionY = 'below';
  @Input() popoverContent: TemplateRef<any>;
  @Input() extraClass: string = 'soho-popover-default';

  @ViewChild(MatMenuTrigger, { static: true })
  private matMenuTrigger: MatMenuTrigger;

  // eslint-disable-next-line @typescript-eslint/naming-convention
  get PopOverMenu(): MatMenuTrigger {
    return this.matMenuTrigger;
  }

  open(): void {
    this.matMenuTrigger.openMenu();
  }

  close(): void {
    this.matMenuTrigger.closeMenu();
  }
}
