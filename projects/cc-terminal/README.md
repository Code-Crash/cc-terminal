# CcTerminalApp

This project is to create a web based terminal.


## How to Install?

### Step 1 (Install Library):

```sh
# Please run following command in your terminal, before running this, make sure you already have installed Node, npm and angular cli.

npm install cc-terminal
```

### Step 2 (To Get the assets from cc-terminal library to your project):

1. Open angular.json
2. Copy/Paste follows config into your architect > build > options > assets:

```
{
  "glob": "**/*",
  "input": "./node_modules/cc-terminal/lib/assets/",
  "output": "./assets"
}

Example: 

"assets": [
  // ... Other assets like "src/favicon.ico", "src/assets",
  {
    "glob": "**/*",
    "input": "./node_modules/cc-terminal/lib/assets/",
    "output": "./assets"
  }
]
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
    // custom styling definition
    this._styles = {
      section: {
        color: 'lightgreen', background: 'black' // To Modify Default Width and Height, Add in Section
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

<!-- Step 2: Add ccStyle property with the defined model in your component -->
<cc-terminal [ccStyle]="_styles"></cc-terminal>
```


```
Note: There are more to come, please have patience! :)
```

## TODO:

- [x] Add classes to re design the terminal configuration from External Module. [In Progress]
- [x] Add Terminal Configuration from External Module.
- [x] Add Feasibility to create a custom commands.
- [x] Add centralize command registry for simplicity. [High Priority]
- [ ] Try to add support for complex commands
- [ ] Add Test Cases
- [ ] Add Support For ASCII Characters on Terminal Output
- [ ] Add Support For Images on Terminal Output
- [ ] Add Support For Videos on Terminal Output
- [ ] Add Support For Custom Design (Graphic or Canvas) on Terminal Output
