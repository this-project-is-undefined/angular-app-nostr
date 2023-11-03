import { AsyncPipe, NgFor } from '@angular/common';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import type { Event } from 'nostr-tools';
import { SimplePool } from 'nostr-tools';
import { BehaviorSubject } from 'rxjs';
import { RELAYS } from 'src/app/constants/relays';
import { ContainerProfileComponent } from './components/container-profile/container-profile.component';
import { NoteCardComponent } from './components/note-card/note-card.component';

@Component({
  standalone: true,
  imports: [ContainerProfileComponent, NoteCardComponent, NgFor, AsyncPipe],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FeedComponent implements OnInit {
  private readonly _events$ = new BehaviorSubject<Array<Event>>([]);
  public readonly events$ = this._events$.asObservable();
  private readonly _pool = new SimplePool();

  public async ngOnInit(): Promise<void> {
    const sub = this._pool.sub(RELAYS, [
      {
        'kinds': [1],
        'limit': 5,
        '#t': ['btc'],
      },
    ]);

    sub.on('event', (event: Event) => {
      this._events$.next([event, ...this._events$.value]);
    });
  }
}
