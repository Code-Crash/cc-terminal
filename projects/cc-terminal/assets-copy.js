var wrench = require("wrench");

var source = "./projects/cc-terminal/src/lib/assets";
var target = "./dist/cc-terminal/lib/assets";

wrench.copyDirSyncRecursive(source, target, {
  forceDelete: true
});

console.log("Audio Asset files successfully copied!");
