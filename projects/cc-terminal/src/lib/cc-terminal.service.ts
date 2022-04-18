import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { CommandStore } from './cc-terminal-command-store';
import cloneDeep from 'lodash.clonedeep';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CcTerminalService implements OnDestroy {
  private ngUnsubscribe = new Subject<boolean>(); // https://stackoverflow.com/questions/38008334/angular-rxjs-when-should-i-unsubscribe-from-subscription/41177163#41177163
  prompt: any;
  public store: CommandStore;
  private event: Subject<BroadcastEvent>;

  constructor() {
    this.event = new Subject<BroadcastEvent>();
    this.readyStore();
  }

  fetch(url: string) {

    return Observable.create(observer => {
      // angular http lib does not support arrayBuffer hence XMLHTTP
      const req = new XMLHttpRequest();
      req.open('get', url, true);
      req.responseType = 'arraybuffer';
      req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
          observer.next(req.response);
          observer.complete();
        }
      };
      req.send();
    });
  }

  // calls the next event with listener id on listening component and data to send
  broadcast(key: any, data?: any) {
    this.event.next({ key, data });
  }

  /**
   * @description - This function will register to execute the store whenever store is ready.
   */
  readyStore() {
    this.on<any>('store-ready').subscribe(_store => {
      this.store = _store;
      this.store.state$.subscribe(state => {
        console.log('StoreReady: In Service:', state);
      });
    });
  }

  // filters through active observers and maps data to a matching observer
  on<T>(key: any): Observable<T> {
    return this.event.asObservable().pipe(filter((event) => event.key === key), map(event => <T>event.data));
  }

  /**
   * @description - Get the Current prompt
   */
  public getPrompt() {
    return this.prompt;
  }

  /**
   * @description - Get the Current store
   */
  public getStore() {
    console.log('here');
    return this.store;
  }

  public initPrompt(config: any) {
    this.prompt = {};
    let _user: any, _path: any, _userPathSeparator: any, _promptEnd: any;
    config = config ? config.promptConfiguration : null;
    const build = () => {
      this.prompt.text = _user + _userPathSeparator + _path + _promptEnd;
    };
    this.prompt.reset = () => {
      _user = config && config.user != null ? (config.user || '') : 'anon';
      _path = config && config.path != null ? (config.path || '') : '\\';
      _userPathSeparator = config && config.separator != null ? (config.separator || '') : '@';
      _promptEnd = config && config.end != null ? (config.end || '') : ':>';
      build();
    };
    this.prompt.text = '';
    this.prompt.reset();
    return this.prompt;
  }


  /**
   * @description - This function will help you to interpret your commands.
   * @param cmd - command
   */
  public interpret(cmd: any) {
    const prompt = this.getPrompt();
    // this.store.state$.subscribe(state => { console.log(state); });
    const command = (cmd.command || '').split(' ');
    let _command = null;
    this.store.state$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(state => {
      _command = cloneDeep(state.commands.filter( // Remove the reference of command by making copy, to avoid modifying the command state
        (item) => {
          return item.name === command[0];
        })[0] || null);
    });
    if (_command && _command.name) {
      if (_command.callback && typeof _command.callback === 'function') {
        _command.callback();
      }
      switch (_command.name) {
        case 'help':
          _command.details.result = _command.details.result.map((_result) => {
            if (_result && _result.text && typeof _result.text === 'function') {
              let text = _result.text(this.store.state.commands.map((c) => { return c.name; }));
              return { ..._result, text };
            } else {
              return _result;
            }
          });
          break;
        default:
          _command.details.result = _command.details.result.map((_result) => {
            if (_result && _result.text && typeof _result.text === 'function') {
              let text = (_result.text()).toString();
              return { ..._result, text };
            } else {
              return _result;
            }
          });
      }
      _command.details.result.splice(0, 0, { text: prompt.text + cmd.command });
      console.log('Final:', _command);
      this.broadcast('terminal-output', _command);
    } else {
      let result = '';
      try {
        result = eval(cmd.command); // eval.call(null, cmd.command);
        if (result !== undefined) {
          this.broadcast('terminal-output', {
            details: {
              output: true,
              result: [
                { text: prompt.text + cmd.command, },
                { text: '' + result },
              ],
              breakLine: true,
            }
          });
        }
      } catch (e) {
        this.broadcast('terminal-output', {
          details: {
            output: true,
            result: [
              { text: prompt.text + cmd.command, },
              { text: '' + e, css: { color: 'red' } },
            ],
            breakLine: true,
          }
        });
      }
    }

    /**
     * @description - Regex for exact match command
     *   note: we can add this in constants
     *  TODO: We can design the exact match regex based command also.
     */
    const regex = { // We can design the exact match regex based command also.
      alert: /^alert$/,
    };

    // Example of how to work with regex based command
    // else if (regex.alert.test(command[0])) {
    // this.broadcast('terminal-output', {
    //   details: {
    //   output: true,
    //   result: [
    //      { text: prompt.text + cmd.command, },
    //      { text: '' + e, css: { color: 'red' } }],
    //     breakLine: true,
    //   }
    // });
    //   command.splice(0, 1); // Remove command from command string
    //   alert(command.join(' '));
    //   console.log(command);
    // }
  }

  ngOnDestroy() {
    // Clear Storage allocation of memory.
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
