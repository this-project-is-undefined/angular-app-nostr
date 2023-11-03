import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import type { ElementRef } from '@angular/core';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, type MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import type { MatChipInputEvent } from '@angular/material/chips';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import type { Event } from 'nostr-tools';
import { getEventHash, SimplePool } from 'nostr-tools';
import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
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
  imports: [
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatAutocompleteModule,
    MatChipsModule,
    NgForOf,
  ],
})
export default class LoginComponent {
  private readonly _api = inject(ApiClientService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _pool = new SimplePool();
  private readonly _step$ = new BehaviorSubject(0);
  public readonly step$ = this._step$.asObservable();
  public readonly form = this._fb.group({
    name: [''],
    description: [''],
    avatar: [''],
    cover: [''],
    npub: [''],
  });

  public separatorKeysCodes: Array<number> = [ENTER, COMMA];
  public fruitCtrl = new FormControl('');
  public filteredFruits: Observable<Array<string>>;
  public fruits: Array<string> = [];
  public allFruits: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  @ViewChild('fruitInput')
  public fruitInput!: ElementRef<HTMLInputElement>;

  public announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  public async start(): Promise<void> {
    this._step$.next(1);
  }

  public async nameDescription(): Promise<void> {
    this._step$.next(2);
  }

  public sendPhotos(): void {
    this._step$.next(3);
  }

  public async finish(): Promise<void> {
    const pbKey = await window.nostr.getPublicKey();
    this._api.create(pbKey).pipe(takeUntilDestroyed(this._destroyRef)).subscribe();
    const values = this.form.value;
    const _baseEvent = await window.nostr.signEvent({
      kind: 0,
      tags: [],
      content: `{"name":"${values.name}","banner":"${values.cover}", "description":"${values.description}","picture":"${values.avatar}"}`,
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
          this._router.navigate(['/feed']);
          isCleared = true;
        }
      }
    } catch (error) {
      console.error('User rejected operation AAAAAH');
    }
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.fruits.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  public remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
