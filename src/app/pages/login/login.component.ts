import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import type { Event } from 'nostr-tools';
import { SimplePool, getEventHash } from 'nostr-tools';
import { BehaviorSubject } from 'rxjs';
import { ApiClientService } from 'src/app/clients/api-client/api-client.service';
import { RELAYS } from 'src/app/constants/relays';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention
  interface Window {
    nostr: Nostr;
  }
}

type Nostr = {
  getPublicKey: () => Promise<string>;
  signEvent: (event: any) => Promise<Event>;
};

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgIf, AsyncPipe],
})
export default class LoginComponent {
  private readonly _api = inject(ApiClientService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _pool = new SimplePool();
  private readonly _step$ = new BehaviorSubject(0);
  public readonly step$ = this._step$.asObservable();

  public async login(): Promise<void> {
    const pbKey = await window.nostr.getPublicKey();
    this._api.create(pbKey).pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
    this._step$.next(1);

    this._router.navigate(['/feed']);
  }

  public async sign(): Promise<void> {
    const _baseEvent = await window.nostr.signEvent({
      kind: 0,
      tags: [],
      content:
        '{"name":"fake nattyyy","banner":"https://st5.depositphotos.com/34579560/62389/v/450/depositphotos_623894038-stock-illustration-flat-design-polygonal-background-vector.jpg", "description":"Smoke weed every day","picture":"null","website":"","lud16":"","nip05":""}',
      created_at: Math.round(Date.now() / 1000),
    });
    console.log(Math.round(Date.now() / 1000));

    try {
      const pubkey = await window.nostr.getPublicKey();

      const { sig } = await window.nostr.signEvent(_baseEvent);

      const event: Event = {
        ..._baseEvent,
        sig,
        pubkey,
        id: getEventHash({ ..._baseEvent, pubkey }),
      };

      let isCleared = false;
      for await (const _req of this._pool.publish(RELAYS, event)) {
        if (isCleared === false) {
          console.log('FIINISH');
          isCleared = true;
        }
      }
    } catch (error) {
      console.error('User rejected operation AAAAAH');
    }
  }
}
