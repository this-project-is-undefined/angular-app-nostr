import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContainerProfileComponent } from './components/container-profile/container-profile.component';
import { NoteCardComponent } from './components/note-card/note-card.component';

@Component({
  standalone: true,
  imports: [ContainerProfileComponent, NoteCardComponent],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FeedComponent {}
