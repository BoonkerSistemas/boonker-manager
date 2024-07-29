import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import Issue from '@core/models/issue';
import { Router } from '@angular/router';

@Component({
  selector: 'soho-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss'],
  animations: fuseAnimations,
})
export class IssueComponent implements OnInit, AfterViewChecked {
  @Input() issue: Issue | null = null;
  statusType: string | null = null;
  statusClass: string | null = null;
  statusTextClass: string | null = null;

  constructor(private _router: Router) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngOnInit() {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ngAfterViewChecked() {
    switch (this.issue.data.status.name) {
      case 'En curso': {
        this.statusType = 'heroicons_solid:lightning-bolt';
        this.statusClass =
          'icon-size-24 opacity-25 text-blue-500 dark:text-blue-400';
        this.statusTextClass = 'text-blue-500';
        break;
      }
      case 'Finalizada': {
        this.statusType = 'heroicons_outline:check-circle';
        this.statusClass =
          'icon-size-24 opacity-25 text-green-500 dark:text-green-400';
        this.statusTextClass = 'text-green-500';
        break;
      }
      case 'Tareas por hacer': {
        this.statusType = 'heroicons_solid:information-circle';
        this.statusClass =
          'icon-size-24 opacity-25 text-yellow-500 dark:text-yellow-400';
        this.statusTextClass = 'text-yellow-500';
        break;
      }
      default: {
        this.statusType = 'heroicons_outline:exclamation-circle';
        this.statusClass =
          'icon-size-24 opacity-25 text-green-500 dark:text-green-400';
        this.statusTextClass = 'text-green-500';
      }
    }
  }

  redirectDetail(): void {
    this._router.navigateByUrl(`/requirements/${this.issue.data.key}`);
  }
}
