# CcTerminalApp

This project contain the source code for [CC Terminal](https://www.npmjs.com/package/cc-terminal).



## How to Install?

```sh
# Please run following command in your terminal, before running this, make sure you already have installed Node, npm and angular cli.

npm install cc-terminal
```

## How to Use?

### Simple Example to use existing functionality

```javascript

// Step 1. In your app.module.ts, first you need to import cc-module and then, you need to add it in imports, please see as below:

... // Other imports Here

import { CcTerminalModule } from 'cc-terminal';

@NgModule({
  declarations: [
    ... // Your other declarations
  ],
  imports: [
    ... // Your other imports
    CcTerminalModule
  ],
  providers: [
    ... // Your other providers
  ],
  bootstrap: [
    ... // Your bootstrap component
  ]
})
``` 

``` html
<!-- Step 2. To use this in you components, you need to just a tag use as follows: -->

<!-- In your any component html file or template style, add follows line, in my case its app.component.html -->

<cc-terminal ></cc-terminal>

```

### Customize Styling Example

```javascript
// Step 1: Add style in your application component

// ... Other imports

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // ... other declaration
  _styles: any; // declaration of a property which will assign to ccStyle in template
  constructor() {
    // custom styling defination
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
  }
}

```

```html

// Step 2: Add ccStyle property with the defined model in your coponent
<cc-terminal [ccStyle]="_styles"></cc-terminal>
```

```
Note: There are more to come, please have patience! :)
```

## TODO:

- [x] Add classes to re design the terminal configuration from External Module. [In Progress]
- [x] Add Terminal Configuration from External Module.
- [x] Add Feasibility to create a custom commands.
- [ ] Add centralize command registry for simplicity. [High Priority]
- [ ] Try to add support for complex commands
- [ ] Add Test Cases
