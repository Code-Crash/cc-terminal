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
    if (cmd.command === 'help') {
      this.broadcast('terminal-output', {
        output: true,
        text: [prompt.text + cmd.command,
          'List of available commands',
          'help   clear   reset',
          // 'Please type {#command help} to see specific help'
        ],
        breakLine: true,
      });
    } else if (cmd.command === 'codecrash') {
      this.broadcast('terminal-output', {
        output: true,
        text: [prompt.text + cmd.command,
          'Hello Code'],
        breakLine: true,
      });
    } else {
      this.broadcast('terminal-output', {
        output: true,
        text: [prompt.text + cmd.command,
          'Command is not supported. please type "help"',
          'to see the list of available commands'],
        breakLine: true,
      });
    }
  }


}
