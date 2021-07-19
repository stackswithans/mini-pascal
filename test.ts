import { isDigit, isLetter } from "./src/lex";
import { equal } from "assert";

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

function testIsLetter() {
    equal(
        letters.every((value) => isLetter(value)),
        true
    );

    equal(
        letters
            .map((value) => value.toUpperCase())
            .every((value) => isLetter(value)),
        true
    );

    equal(
        digits.every((value) => isLetter(value)),
        false
    );

    equal(
        delimeters.every((value) => isLetter(value)),
        false
    );
}

function testIsDigit() {
    equal(
        digits.every((value) => isDigit(value)),
        true
    );

    equal(
        letters.every((value) => isDigit(value)),
        false,
        "Is digit failed"
    );

    equal(
        delimeters.every((value) => isDigit(value)),
        false
    );
}

function main() {
    console.log("Testing isDigit...");
    testIsDigit();
    console.log("isDigit has passed!\n\n");
    console.log("Testing isLetter...");
    testIsLetter();
    console.log("isLetter has passed!\n\n");
    console.log("All tests passed!");
}

main();
