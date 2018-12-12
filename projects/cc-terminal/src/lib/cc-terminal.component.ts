import {
  Component, OnInit,
  OnDestroy, DoCheck, ElementRef,
  ViewChild, Input, Renderer2
} from '@angular/core';
import { CcTerminalService } from './cc-terminal.service';
import Timer = NodeJS.Timer;

@Component({
  selector: 'cc-terminal',
  templateUrl: './cc-terminal.component.html',
  styleUrls: ['./cc-terminal.component.css']
})
export class CcTerminalComponent implements OnInit, OnDestroy, DoCheck {
  title = 'cc-terminal';
  _command: String = '';
  _cursor: String = '_';
  _prompt: any;
  _results: any = [];
  _showPrompt: Boolean = true;
  _tService: CcTerminalService;
  private _cmdHistory: any = [];
  private _cmdIndex: number = -1;
  private _initial: Boolean = true;
  private _nonPrintRE: any;
  private _config: any;
  private _outputDelay: any;
  private _allowTypingWriteDisplaying: Boolean;
  private _hasFocus: Timer;
  private _mOver: Boolean = false; // Mouse Over
  private _aContext: AudioContext; // Audio Context
  private _aBuffer: AudioBuffer; // Audio Buffer
  private _prevLength: number = 0;
  private _disposableOutputObserver: any;
  private _disposableCommandObserver: any;
  @ViewChild('cc_terminal') terminal: ElementRef;
  @ViewChild('cc_terminal_viewport') terminalViewport: ElementRef;
  @ViewChild('cc_terminal_results') terminalResults: ElementRef;
  @ViewChild('cc_terminal_target') terminalTarget: ElementRef;
  @Input() externalConfig: any; // Get All the external config, classes or more custom settings from different module

  /**
   * @description - adds \n to all strings that need formatting at index of string
   *              - todo function is not able to break line twice in case the remaining string is still longer than
   *              - todo screen -> but it would be best this does not happen -> maybe require min width of terminal div
   * @param width - width
   * @param text  - text
   * @param chr - character
   */
  static _insertLineBreakToString(width: number, text: string, chr: string) {
    const index = Math.round(width / 8);
    if (text.length > index) {
      // returns text with line-break chr added at element width offset ratio
      return text.substr(0, index) + chr + text.substr(index + 1);
    } else {
      return text;
    }
  }

  /**
   * @description - This static function will clear the all output of the terminal commands
   */
  static _clearTerminalResultsChildElements() {
    const elements = document.getElementById('cc_terminal_results');
    while (elements.firstChild) {
      elements.removeChild(elements.firstChild);
    }
  }

  constructor(_tService: CcTerminalService, private renderer: Renderer2) { // renderer to add the class dynamically, while creating and rendering the output element
    this._initializeConfig();
    this._tService = _tService;
    this._prompt = _tService.initPrompt(this._config);
    this._outputDelay = this._config.outputDelay;
    this._allowTypingWriteDisplaying = this._config.allowTypingWriteDisplaying;
    const obsTerminalOutput = _tService.on<any>('terminal-output');
    this._disposableOutputObserver = obsTerminalOutput.subscribe(termOut => {
      if (!termOut.added) {
        termOut.added = true;
        this._results.push(termOut);
      }
    });
    const obsTerminalCommand = _tService.on<any>('terminal-command');
    this._disposableCommandObserver = obsTerminalCommand.subscribe(cmd => {
      if (cmd.command === 'clear') {
        this._results.splice(0, this._results.length);
        CcTerminalComponent._clearTerminalResultsChildElements();
      }
      if (cmd.command === 'reset') {
        this._initializeConfig();
        this._results = [];
        CcTerminalComponent._clearTerminalResultsChildElements();
        this._initial = true;
        // this.ngOnInit();
        this.ngOnInit();
        this._blur();
        this._clickHandler();
        // this.terminalViewport.nativeElement.click();
        // const el: HTMLElement = this.terminalViewport.nativeElement as HTMLElement;
        // el.click();
        // this.terminalViewport.nativeElement.click();
      }
      _tService.interpret(cmd);
    });
  }

  _initializeConfig() {
    this._command = '';
    this._nonPrintRE = /[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g;
    this._config = {
      outputDelay: 8, // Output display should be more than 0
      allowTypingWriteDisplaying: true,
      maxHistory: 50,
      typeSoundUrl: 'assets/type.wav',
      startSoundUrl: 'assets/start.wav',
      promptConfiguration: { end: ':>', user: 'CodeCrash', separator: '@', path: '\\' }
    };
  }

  _handlePaste(e: any) {
    this._command += e.clipboardData.getData('text/plain');
  }

  ngOnInit() {
    this._aContext = new AudioContext();
    this._doSound(this._config.startSoundUrl);
    console.log('externalConfig:', this.externalConfig);
  }

  ngOnDestroy() {
    this._disposableOutputObserver.unsubscribe();
    this._disposableCommandObserver.unsubscribe();
  }

  ngDoCheck() {
    // simple added to array detection
    if (this._prevLength < this._results.length) {
      // check if history grows too big then maxHistory
      if (this._results.length > this._config.maxHistory) {
        this._results.splice(0, 1);
        this.terminalResults.nativeElement.children[0].remove();
      }
      this._addToTerminalResults();
    }
    this._prevLength = this._results.length;
  }

  /**
   * @description - This will add the output on the terminal
   */
  private _addToTerminalResults() {
    const _handlePromptScroll = [() => {
      this._showPrompt = true; // while rendering output, hide prompt
      this.terminalViewport.nativeElement.scrollTop = this.terminalViewport.nativeElement.scrollHeight; // always put scroll to bottom
    }];
    this._showPrompt = false;
    const change = this._results[this._results.length - 1];
    const spanElement = this.renderer.createElement('span');
    if (this._outputDelay) {
      for (let i = change.text.length - 1; i >= 0; i--) { // only reverse loop will type out the lines with delay proper and in order
        this._createTypedOutputElement(spanElement, change, i, _handlePromptScroll);
      }
      setTimeout(() => { // start line by line typing execution chain to handle show/hide prompt
        _handlePromptScroll[_handlePromptScroll.length - 1]();
      }, 200);
    } else {
      for (let i = 0; i < change.text.length; i++) { // paste everything at once
        this._createOutputElement(spanElement, change, i);
      }
      if (change.breakLine) {
        const breakLine = this.renderer.createElement('br');
        spanElement.appendChild(breakLine);
      }
    }
  }

  /**
   * @description - This will will create a command typed to command prompt and do print on output
   */
  private _createTypedOutputElement(span: HTMLSpanElement, change: any, i: number, _handlePromptScroll: (() => any)[]) {
    const lineBr = ' -> \n ';
    const { line, textLine } = this._createOutputLineElement(change, i, lineBr);
    if (change.output) {
      line.textContent = ' ';
      const fi = _handlePromptScroll.length - 1;
      const wLine = line; // World Line
      const wTextLine = textLine; // World Text Line
      const wf = _handlePromptScroll[fi]; // to call the next _handlePromptScroll[i] recursively after previous line type has finished
      const wBreak = i === change.text.length - 1 && change.breakLine; // World Break
      _handlePromptScroll.push(() => {
        span.appendChild(wLine); // initialize empty line to type out
        this.terminalResults.nativeElement.appendChild(span);
        this._type(wLine, wTextLine, 0, wf); // send line to type() so each character gets displayed coupled with a type sound
        this.terminalViewport.nativeElement.scrollTop = this.terminalViewport.nativeElement.scrollHeight;
        if (wBreak) {
          const breakLine = this.renderer.createElement('br');
          span.appendChild(breakLine);
          this.terminalResults.nativeElement.appendChild(span);
        }
      });
    } else {
      line.textContent = textLine;
      span.appendChild(line);
      this.terminalResults.nativeElement.appendChild(span);
    }
  }

  private _createOutputElement(span: HTMLSpanElement, change: any, i: number) {
    const lineBr = ' -> \n';
    const { line } = this._createOutputLineElement(change, i, lineBr);
    span.appendChild(line);
    this.terminalResults.nativeElement.appendChild(span);
    setTimeout(() => {
      // this.renderer.setElementClass(line, 'cc_terminal_line', true);
    }, 1000);
  }

  private _createOutputLineElement(change: any, i: number, lineBr: string) {
    const line = this.renderer.createElement('div');
    if (change.color) {
      line.style.color = change.color;
    }
    // line.className = 'cc_terminal_line';

    this.renderer.addClass(line, 'cc_terminal_line');
    let textLine: string;
    const elWidth = this.terminalViewport.nativeElement.firstElementChild.clientWidth;
    // format -> the stream needs formatting to show with appropriate line breaks on the screen
    if (change.format) {
      textLine = CcTerminalComponent._insertLineBreakToString(elWidth, change.text[i], lineBr);
    } else {
      textLine = change.text[i];
    }
    return { line, textLine };
  }

  _type(input, line, i, endCallback) {
    setTimeout(() => {
      this._doSound(this._config.typeSoundUrl);
      input.textContent += (i < line.length ? line[i] : '');
      if (i < line.length - 1) {
        this._doSound(this._config.typeSoundUrl);
        this._type(input, line, i + 1, endCallback);
      } else if (endCallback) {
        endCallback();
      }
    }, this._outputDelay);
  }

  _doSound(uri: string): void {
    this._loadAudio(uri).then((_audioBuffer) => {
      this._aBuffer = _audioBuffer;
      this._playAudio();
    }).catch(error => { throw error; });
  }

  _loadAudio(source: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
      this._tService.fetch(source).subscribe(buffer => {
        this._aContext.decodeAudioData(buffer, resolve, reject);
      });
    });
  }

  _playAudio() {
    const bufferSource = this._aContext.createBufferSource();
    bufferSource.buffer = this._aBuffer;
    bufferSource.connect(this._aContext.destination);
    bufferSource.start(0);
  }

  _mouseover() {
    this._mOver = true;
  }

  _mouseleave() {
    this._mOver = false;
  }

  _clickHandler() {
    this.terminalTarget.nativeElement.focus();
    this.terminal.nativeElement.classList.toggle('cc_terminal_focused', true);
  }

  _blur() {
    clearInterval(this._hasFocus);
    if (!this._mOver) {
      this._cursor = '_';
    }
    this.terminal.nativeElement.classList.toggle('cc_terminal_focused', false);
  }

  /**
   * @description - This will called when user will focus on input
   */
  _focus() {
    if (this._initial) {
      this._tService.broadcast('terminal-output', {
        text: ['How can I help you?'],
        breakLine: true,
        output: true,
        color: 'red',
        format: true
      });
    }
    this._initial = false;
    this._hasFocus = setInterval(() => {
      if (this._cursor === '') {
        this._cursor = '_';
      } else {
        this._cursor = '';
      }
    }, 500);
  }

  _key(e) {
    if (this._showPrompt || this._allowTypingWriteDisplaying) {
      this._keypress(e.which);
    }
    e.preventDefault();
  }

  _keypress(keyCode: number) {
    if (this._command.length < 80) {
      this._cmdIndex = -1;
    }
    if (keyCode !== 13) {
      this._command += String.fromCharCode(keyCode);
    }
  }

  _keydown(e) {

    if (e.keyCode === 9) { // Tab ke
      e.preventDefault();
    }
    if (e.keyCode === 8) { // Backspace key
      if (this._showPrompt || this._allowTypingWriteDisplaying) {
        this._backspace();
      }
      e.preventDefault();
    } else if (e.keyCode === 13) { // Enter key
      if (this._showPrompt || this._allowTypingWriteDisplaying) {
        this._execute();
      }
    } else if (e.keyCode === 38) { // key-up
      if (this._showPrompt || this._allowTypingWriteDisplaying) {
        this._previousCommand();
      }
      e.preventDefault();
    } else if (e.keyCode === 40) { // key-down key
      if (this._showPrompt || this._allowTypingWriteDisplaying) {
        this._nextCommand();
      }
      e.preventDefault();
    }
  }

  _nextCommand() {
    if (this._cmdIndex === -1) {
      return;
    }
    if (this._cmdIndex < this._cmdHistory.length - 1) {
      this._command = this._cmdHistory[++this._cmdIndex];
    } else {
      this._command = '';
    }
  }

  _previousCommand() {
    if (this._cmdIndex === -1) {
      this._cmdIndex = this._cmdHistory.length;
    }
    if (this._cmdIndex === 0) {
      return;
    }
    this._command = this._cmdHistory[--this._cmdIndex];
  }

  _cleanNonPrintableCharacters(input: String) {
    return input.replace(this._nonPrintRE, '');
  }

  _execute() {
    const command = this._cleanNonPrintableCharacters(this._command);
    this._command = '';
    if (!command) {
      return;
    }
    if (this._cmdHistory.length > 10) {
      this._cmdHistory.splice(0, 1);
    }
    if (command !== this._cmdHistory[this._cmdHistory.length - 1]) {
      this._cmdHistory.push(command);
    }
    this._tService.broadcast('terminal-command', { command: command });
  }

  _backspace() {
    if (this._command) {
      this._command = this._command.substring(0, this._command.length - 1);
    }
  }


}
