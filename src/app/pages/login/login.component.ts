import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import type { EventTemplate } from 'nostr-tools';
import { ApiClientService } from 'src/app/clients/api-client/api-client.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention
  interface Window {
    nostr: Nostr;
  }
}

type Nostr = {
  getPublicKey: () => Promise<string>;
  signEvent: (event: EventTemplate) => Promise<Event>;
};

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatButtonModule],
})
export default class LoginComponent {
  private readonly _api = inject(ApiClientService);
  private readonly _destroyRef = inject(DestroyRef);

  public async login(): Promise<void> {
    const pbKey = await window.nostr.getPublicKey();
    this._api.create(pbKey).pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
  }
}
