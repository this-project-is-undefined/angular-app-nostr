import { AsyncPipe, JsonPipe } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import type { Event } from 'nostr-tools';
import { SimplePool } from 'nostr-tools';
import { BehaviorSubject } from 'rxjs';
import { RELAYS } from 'src/app/constants/relays';

export const jsonStringToObject = (
  jsonString: string,
): { name?: string; banner?: string; picture?: string; about?: string } => {
  try {
    const jsonObject = JSON.parse(jsonString) as {
      name?: string;
      banner?: string;
      picture?: string;
      about?: string;
    };
    return jsonObject;
  } catch (error) {
    throw new Error('Invalid JSON string');
  }
};

@Component({
  selector: 'app-container-profile',
  standalone: true,
  imports: [MatCardModule, JsonPipe, AsyncPipe],
  templateUrl: './container-profile.component.html',
  styleUrls: ['./container-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContainerProfileComponent implements OnInit {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _pool = new SimplePool();

  private readonly _img$ = new BehaviorSubject<string>('');
  public readonly img$ = this._img$.asObservable();

  public readonly form = this._fb.group({
    name: [''],
    about: [''],
    avatar: [''],
    cover: [''],
    npub: [''],
    followers: [0],
    following: [0],
    notes: [0],
  });

  public async ngOnInit(): Promise<void> {
    const pbKey = await window.nostr.getPublicKey();

    const sub = this._pool.sub(RELAYS, [
      {
        kinds: [0],
        authors: [pbKey],
      },
    ]);

    sub.on('event', (data: Event<0>) => {
      const parsedData = jsonStringToObject(data.content);
      console.log(parsedData.name ?? `anon${data.pubkey.slice(0, 4)}`);

      this._img$.next(
        this._img$.value === '' || parsedData.picture === undefined
          ? `https://api.dicebear.com/5.x/identicon/svg?seed=${data.id}`
          : parsedData.picture,
      );
      this.form.patchValue({
        name: parsedData.name ?? `anon${data.pubkey.slice(0, 4)}`,
        about: parsedData.about ?? '',
        avatar: parsedData.picture ?? `https://api.dicebear.com/5.x/identicon/svg?seed=${data.id}`,
        cover: parsedData.banner ?? '',
        npub: data.pubkey,
      });
    });

    // eose = end of stored events
    sub.on('eose', () => {
      sub.unsub();
    });
  }
}
