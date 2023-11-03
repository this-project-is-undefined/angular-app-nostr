import { ChangeDetectionStrategy, Component } from '@angular/core';

export type Tile = {
  color: string;
  cols: number;
  rows: number;
  text: string;
  icon: string;
  route: string
  isActive: boolean | null
}


@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export default class LoginComponent {
}
