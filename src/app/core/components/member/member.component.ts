import { Component, Input } from '@angular/core';

@Component({
  selector: 'soho-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent {
  @Input() source!: string;
  @Input() name!: string;
  @Input() role!: string;
}
