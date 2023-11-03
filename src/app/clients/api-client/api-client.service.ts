import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import type { User } from './models/user';

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly _httpClient = inject(HttpClient);

  public create(npub: string): Observable<User> {
    return this._httpClient.post<User>(`${environment.api}/user`, { npub });
  }
}
