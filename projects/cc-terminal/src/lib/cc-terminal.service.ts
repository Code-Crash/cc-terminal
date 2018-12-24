import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class CcTerminalService {

  prompt: any;
  private event: Subject<BroadcastEvent>;

  constructor() {
    this.event = new Subject<BroadcastEvent>();
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

  // filters through active observers and maps data to a matching observer
  on<T>(key: any): Observable<T> {
    return this.event.asObservable().pipe(filter((event) => event.key === key), map(event => <T>event.data));
  }

  public getPrompt() {
    return this.prompt;
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

    /**
     * @description - Regex for exact match command
     *   note: we can add this in constants
     */
    const regex = { // We can design the exact match regex based command also.
      alert: /^alert$/,
    };

    const command = (cmd.command || '').split(' ');
    if (command[0] === 'help') {
      this.broadcast('terminal-output', {
        output: true,
        result: [
          { text: prompt.text + cmd.command, },
          { text: 'List of available commands' },
          { text: 'help   clear   reset' },
        ],
        breakLine: true,
      });
    } else if (command[0] === 'codecrash') {
      this.broadcast('terminal-output', {
        output: true,
        result: [
          { text: prompt.text + cmd.command, },
          { text: 'Hello Code' },
        ],
        breakLine: true,
      });
    } else {
      let result = '';
      try {
        result = eval(cmd.command); // eval.call(null, cmd.command);
        if (result !== undefined) {
          this.broadcast('terminal-output', {
            output: true,
            result: [
              { text: prompt.text + cmd.command, },
              { text: '' + result },
            ],
            breakLine: true,
          });
        }
      } catch (e) {
        this.broadcast('terminal-output', {
          output: true,
          result: [
            { text: prompt.text + cmd.command, },
            { text: '' + e, css: { color: 'red' } },
          ],
          breakLine: true,
        });
      }
    }

    // Example of how to work with regex based command
    // else if (regex.alert.test(command[0])) {
    //   this.broadcast('terminal-output', {
    //     output: true,
    //     result: [
    //        { text: prompt.text + cmd.command, },
    //        { text: '' + e, css: { color: 'red' } }]
    //     breakLine: true,
    //   });
    //   command.splice(0, 1); // Remove command from command string
    //   alert(command.join(' '));
    //   console.log(command);
    // }

  }


}
