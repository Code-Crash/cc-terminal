var fs = require("fs-extra");

var source = "./projects/cc-terminal/src/lib/assets";
var target = "./dist/cc-terminal/lib/assets";


fs.copy(source, target).then(() => console.log('success!')).catch(err => console.error(err))

console.log("Audio Asset files successfully copied!");
