import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { Event, EventTemplate } from 'nostr-tools';
import { SimplePool, getEventHash } from 'nostr-tools';
import { RELAYS } from 'src/app/constants/relays';

const extractHashtags = (text: string): Array<string> => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[0].split('#')[1] as string);
  }

  return hashtags;
};

@Component({
  selector: 'app-note-creator',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatCardModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './note-creator.component.html',
  styleUrls: ['./note-creator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoteCreatorComponent {
  private readonly _fb = inject(NonNullableFormBuilder);
  public readonly post = this._fb.control('');
  private readonly _pool = new SimplePool();

  public async createNote(): Promise<void> {
    const hashtags = extractHashtags(this.post.value);
    console.log(hashtags);

    if (!window.nostr) {
      alert('Nostr extension not found');
      return;
    }
    // Construct the event object
    const _baseEvent: EventTemplate = {
      content: this.post.value,
      created_at: Math.round(Date.now() / 1000),
      kind: 1,
      tags: hashtags.map(tag => ['t', tag]),
    };

    // Sign this event (allow the user to sign it with their private key)
    // // check if the user has a nostr extension

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
        isCleared = true;
      }
    }

    this.post.setValue('');
  }
}
