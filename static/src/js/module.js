// file "module.js"
export var someVar = "Some data";

export function someFunc() {
    return " for output";
}

// this has no "export" prefixed hence cannot be used outside this module 
function someOtherFunction() {
    return 1;
}