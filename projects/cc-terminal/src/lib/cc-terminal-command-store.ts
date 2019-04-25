// https://jurebajt.com/state-management-in-angular-with-observable-store-services/
import { Injectable } from '@angular/core';
import { Store } from './store';
import { CommandState, CommandInterface } from './cc-terminal-command-state';

@Injectable()
export class CommandStore extends Store<CommandState> {
  constructor() {
    super(new CommandState());
  }

  public addKeyValue(command: { name: string, key: string, value: any }): void {
    this.setState({
      ...this.state,
      commands: this.state.commands.map(c => {
        if (c.name === command.name) {
          if (c.details && !c.details.readonly) {
            if (!c['details'][command.key]) { c['details'][command.key] = null; } // If key not exists, make one
            return { ...c, details: { ...{ ...c.details, [command.key]: command.value } } };
          } else {
            console.error('You are trying to modify the readonly command, which is not allowed, command name: ' + command.name);
            return { ...c }; // You are trying modify readonly command, which is not possible.
          }
        }
        return c;
      })
    });
  }

  /**
   * @description - This function will add the command
   *
   * @param command
   */
  public addCommand(command: CommandInterface): void {
    let _regex = /^[a-zA-Z]+$/;
    if (command && command.name && _regex.test(command.name)) {
      if (command && command.details && command.details.hasOwnProperty('output')) {
        const exists = this.state.commands.map(function (e) { return e.name; }).indexOf(command.name);
        if (exists === -1) {
          this.setState({
            ...this.state,
            commands: [...this.state.commands, command]
          });
        } else {
          console.error('You are trying to add duplicate command, which is not allowed, command name: ' + command.name);
          // alert('You are trying to add duplicate command, which is not allowed, command name: ' + command.name);
          // throw 'You are trying to add duplicate command, which is not allowed, command name: ' + command.name;
        }
      } else {
        console.error('To add a new command, we need output property, command name: ' + command.name);
      }
    } else {
      console.error('Command name is not valid to add in command list, command name should be from [a-z | A-Z] without containing space, command name: ' + command.name);
    }
  }
}
