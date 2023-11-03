import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import type { Event } from 'nostr-tools';
import { SimplePool } from 'nostr-tools';
import { RELAYS } from 'src/app/constants/relays';
import { jsonStringToObject } from '../container-profile/container-profile.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-note-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, JsonPipe, AsyncPipe, DatePipe],
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCardComponent implements OnInit {
  private readonly _pool = new SimplePool();
  private readonly _metadata$ = new BehaviorSubject<{
    name?: string;
    banner?: string;
    picture?: string;
    description?: string;
  } | null>(null);

  public readonly metadata$ = this._metadata$.asObservable();

  @Input()
  public event!: Event;

  public ngOnInit(): void {
    this.getMetadata(this.event.pubkey);
  }

  public getLinkandText(inputText: string): { text: string; link: string } {
    // Regular expression to match an HTTPS link
    const httpsLinkRegex = /https:\/\/\S+/;

    // Find the first match in the input text
    const linkMatch = inputText.match(httpsLinkRegex);

    if (linkMatch) {
      // Extract the HTTPS link
      const [link] = linkMatch;

      // Remove the link from the input text
      const cutText = inputText.replace(link, '');

      // Create and return the object with the cut text and link properties
      return { text: cutText, link };
    }
    // If no link is found, return the input text as is
    return { text: inputText, link: '' };
  }

  public getMetadata(pbKey: string): void {
    const sub = this._pool.sub(RELAYS, [
      {
        kinds: [0],
        authors: [pbKey],
      },
    ]);

    let dataObj = new Object() as any;
    sub.on('event', (data: Event<0>) => {
      dataObj = jsonStringToObject(data.content);
      this._metadata$.next(dataObj);
    });
  }
}
