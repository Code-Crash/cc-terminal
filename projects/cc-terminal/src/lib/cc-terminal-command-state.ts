// https://jurebajt.com/state-management-in-angular-with-observable-store-services/
const COMMANDS = [
  {
    name: 'help',
    details: {
      output: true,
      readonly: true,
      breakLine: true,
      result: [
        { text: 'List of available commands' },
        {
          text: function (commands) {
            return commands.join(' ');
          }
        }
      ],
    }
  },
  {
    name: 'author',
    details: {
      output: true,
      readonly: true,
      breakLine: true,
      result: [
        { text: 'Pravin Tiwari<code-crash> [pravintiwari1992@gmail.com]' },
      ],
    }
  }
];


export interface CommandResultInterface {
  text: string | Function; // Can be string or function
  css?: object; // It always will be object of styling
}

export interface CommandInterface {
  name: string;
  details: {
    output?: boolean,
    readonly?: boolean,
    breakLine?: boolean,
    format?: any,
    result: CommandResultInterface[]
  };
  callback?: Function,
}

export class CommandState {
  commands: CommandInterface[] = COMMANDS;
}

