import { Component, OnInit, OnDestroy } from '@angular/core';
import { CcTerminalService } from '../../projects/cc-terminal/src/public_api';
@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cc-terminal-app';
  _styles: any;
  _tService: CcTerminalService;
  _command = '';
  _config: any;
  _enabledExternal = true;
  _prompt = { end: '$', user: 'Sumit', separator: '@', path: '\\' };
  _disposableCommandObserver: any;

  constructor(_tService: CcTerminalService) {
    // this._tComponent._command = '';
    // this._initializeConfig();
    this._tService = _tService;

    // Add more config support, custom styling
    this._styles = {
      section: {
        color: 'lightgreen', background: 'black'
      },
      viewport: {
        color: 'yellow', background: 'black'
      },
      input: {
        color: 'red', background: 'black'
      },
      cursor: {
        color: 'green', background: 'black'
      }
    };
    this.initService(); // Setup your custom commands
  }

  initService() {
    this._disposableCommandObserver = this._tService.on<any>('terminal-command').subscribe(cmd => {
      if (cmd.command === 'about') {
        this._tService.broadcast('terminal-output', {
          output: true,
          result: [{ text: this._tService.prompt.text + cmd.command }, { text: 'Pravin' }],
          breakLine: true,
        });
      } else if (cmd.command === 'author') {
        this._tService.broadcast('terminal-output', {
          output: true,
          result: [{ text: this._tService.prompt.text + cmd.command }, { text: 'Pravin Tiwari<code-crash> [pravintiwari1992@gmail.com]' }],
          breakLine: true,
        });
      } else {
        if (this._enabledExternal) {
          this._tService.interpret(cmd);
        }
      }
    });
  }

  ngOnInit() {
    console.log('Custom App Initialized!');
  }

  ngOnDestroy() {
    this._disposableCommandObserver.unsubscribe();
  }

}
