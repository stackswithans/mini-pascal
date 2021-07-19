"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.isLetter = exports.isDigit = void 0;
var LexState;
(function (LexState) {
    LexState[LexState["ARITHOP"] = 0] = "ARITHOP";
    LexState[LexState["COMPARISON"] = 1] = "COMPARISON";
    LexState[LexState["LOGICALOP"] = 2] = "LOGICALOP";
    LexState[LexState["DELIMETER"] = 3] = "DELIMETER";
    LexState[LexState["IDENTIFIER"] = 4] = "IDENTIFIER";
    LexState[LexState["NUMBER"] = 5] = "NUMBER";
    LexState[LexState["STRING"] = 6] = "STRING";
    LexState[LexState["EOF"] = 7] = "EOF";
})(LexState || (LexState = {}));
const literals = {
    aritOps: ["+", "-", "*", "/"],
    logicOps: ["<", ">", "="],
    delimeters: ["(", "[", "."],
};
const isDigit = (char) => {
    let code = char.codePointAt(0);
    return code >= 48 && code <= 57;
};
exports.isDigit = isDigit;
const isLetter = (char) => {
    let code = char.codePointAt(0);
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
};
exports.isLetter = isLetter;
class Lexer {
    constructor(program) {
        this.program = program;
        this.fLine = 1;
        this.fCol = 1;
        this.cursor = 0;
        this.updateState();
    }
    updateState() {
        if (this.cursor >= this.program.length) {
            this.state = LexState.EOF;
            return;
        }
        let char = this.program[this.cursor];
        if (literals.aritOps.some((value) => char === value)) {
            this.state = LexState.ARITHOP;
        }
        else if (literals.logicOps.some((value) => char === value)) {
            this.state = LexState.LOGICALOP;
        }
        else if (literals.delimeters.some((value) => char === value)) {
            this.state = LexState.DELIMETER;
        }
        else if (exports.isDigit(char)) {
            this.state = LexState.NUMBER;
        }
        else if (exports.isLetter(char)) {
            this.state = LexState.STRING;
        }
    }
    nextChar() {
        if (this.cursor >= this.program.length) {
            return "";
        }
        let char = this.program[this.cursor];
        if (char == "\n") {
            this.fLine += 1;
            this.fCol = 1;
        }
        else {
            this.fCol += 1;
        }
        return char;
    }
    peekNextChar() {
        if (this.cursor + 1 >= this.program.length)
            return "";
        return this.program[this.cursor + 1];
    }
}
exports.Lexer = Lexer;
//# sourceMappingURL=lex.js.map