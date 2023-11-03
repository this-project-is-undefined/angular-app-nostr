import { Injectable } from '@angular/core';
import { v4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class UniqueIdService {
  private _numberOfGeneratedIds = 0;

  /**
   * Regex to validate the prefix according to the following rules:
   * - It must start with a letter;
   * - It can only contain letters, numbers, hyphens and colons;
   * - It cannot have spaces.
   * PS: It follows the same rules as the HTML id attribute from the W3C
   */
  private readonly _validId = /^[A-Za-z]+[\w\-:.]*$/;

  public generateUniqueIdWithPrefix(prefix: string): string | Error {
    const isPrefixValid = Boolean(prefix) && this._validId.test(prefix);
    const uniqueId = this._generateUniqueId;
    this._numberOfGeneratedIds += 1;
    return isPrefixValid ? `${prefix}-${uniqueId}` : `unique-id-service-${uniqueId}`;
  }

  /**
   * Returns the number of generated unique ids in the service
   * @returns The number of generated unique ids as `number`
   */
  public get getNumberOfGeneratedUniqueIds(): number {
    return this._numberOfGeneratedIds;
  }

  /**
   * Generates a unique id using uuid library
   * @returns An unique id as `string`
   */
  private get _generateUniqueId(): string {
    return v4();
  }
}
