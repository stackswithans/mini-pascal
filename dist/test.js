"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_1 = require("./src/parse");
const assert_1 = require("assert");
const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const delimeters = ["<", ">", ".", "!", "=", ":", ";", "/", "=", "+", "-"];
assert_1.equal(letters.every((value) => parse_1.isLetter(value)), true);
assert_1.equal(letters
    .map((value) => value.toUpperCase())
    .every((value) => parse_1.isLetter(value)), true);
assert_1.equal(digits.every((value) => parse_1.isLetter(value)), false);
assert_1.equal(delimeters.every((value) => parse_1.isLetter(value)), false);
assert_1.equal(digits.every((value) => parse_1.isDigit(value)), true);
assert_1.equal(letters.every((value) => parse_1.isDigit(value)), false, "Is digit failed");
assert_1.equal(delimeters.every((value) => parse_1.isDigit(value)), false);
console.log("All tests passed!");
//# sourceMappingURL=test.js.map