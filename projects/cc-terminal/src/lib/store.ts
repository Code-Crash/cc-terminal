// https://jurebajt.com/state-management-in-angular-with-observable-store-services/
import { Observable, BehaviorSubject } from 'rxjs';

/**
 * @description - This Class will work as a storage of any kind of data, but we will going to store the commands for now
 */
export class Store<T> {
  state$: Observable<T>;
  private _state$: BehaviorSubject<T>;

  protected constructor(initialState: T) {
    this._state$ = new BehaviorSubject(initialState);
    this.state$ = this._state$.asObservable();
  }

  public get state(): T {
    return this._state$.getValue();
  }

  protected setState(nextState: T): void {
    this._state$.next(nextState);
  }
}
