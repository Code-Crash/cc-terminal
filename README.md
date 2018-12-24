# CcTerminalApp

This project contain the source code for [CC Terminal](https://www.npmjs.com/package/cc-terminal) version 0.0.1.



## How to Install?

```sh
# Please run following command in your terminal, before running this, make sure you already have installed Node, npm and angular cli.

npm install cc-terminal
```

## How to Use?

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

```
Note: There are more to come, please have patience! :)
```

## TODO:

- [ ] Add classes to re design the terminal configuration from External Module.
- [ ] Add Terminal Configuration from External Module.
- [ ] Add Feasibility to create a custom commands.
- [ ] Try to add support for complex commands
- [ ] Add Test Cases
