"use strict";
exports.__esModule = true;
exports.Lexer = exports.isLetter = exports.isDigit = void 0;
var token_1 = require("./token");
var LexState;
(function (LexState) {
    LexState[LexState["ARITHOP"] = 0] = "ARITHOP";
    LexState[LexState["LOGICALOP"] = 1] = "LOGICALOP";
    LexState[LexState["DELIMETER"] = 2] = "DELIMETER";
    LexState[LexState["IDENTIFIER"] = 3] = "IDENTIFIER";
    LexState[LexState["NUMBER"] = 4] = "NUMBER";
    LexState[LexState["STRING"] = 5] = "STRING";
    LexState[LexState["EOF"] = 6] = "EOF";
})(LexState || (LexState = {}));
var literals = {
    aritOps: ["+", "-", "*", "/"],
    logicOps: ["<", ">", "="],
    delimeters: ["(", ")", "[", "]", ".", ",", ":", ";"]
};
var isDigit = function (char) {
    var code = char.codePointAt(0);
    return code >= 48 && code <= 57;
};
exports.isDigit = isDigit;
var isLetter = function (char) {
    var code = char.codePointAt(0);
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
};
exports.isLetter = isLetter;
var Lexer = /** @class */ (function () {
    function Lexer(program) {
        this.program = program;
        this.fLine = 1;
        this.fCol = 1;
        this.cursor = 0;
        this.updateState();
    }
    Lexer.prototype.updateState = function () {
        if (this.cursor >= this.program.length) {
            this.state = LexState.EOF;
            return;
        }
        var char = this.getChar();
        var whitespace = /\s/;
        //Skip whitespace
        while (whitespace.test(char)) {
            this.advanceChar();
            char = this.getChar();
        }
        if (literals.aritOps.some(function (value) { return char === value; })) {
            this.state = LexState.ARITHOP;
        }
        else if (literals.logicOps.some(function (value) { return char === value; })) {
            this.state = LexState.LOGICALOP;
        }
        else if (literals.delimeters.some(function (value) { return char === value; })) {
            this.state = LexState.DELIMETER;
        }
        else if (exports.isDigit(char)) {
            this.state = LexState.NUMBER;
        }
        else if (exports.isLetter(char)) {
            this.state = LexState.IDENTIFIER;
        }
        else if (char === "'" || char === '"') {
            this.state = LexState.STRING;
        }
        else if (char == "") {
            this.state = LexState.EOF;
        }
        else {
            console.dir(char);
            throw new Error("Lexema desconhecido: " + char);
        }
    };
    Lexer.prototype.advanceChar = function () {
        if (this.cursor >= this.program.length) {
            return "";
        }
        var char = this.program[this.cursor];
        if (char === "\n") {
            this.fCol = 1;
            this.fLine += 1;
        }
        else {
            this.fCol += 1;
        }
        this.cursor += 1;
        return char;
    };
    Lexer.prototype.getChar = function () {
        if (this.cursor >= this.program.length) {
            return "";
        }
        return this.program[this.cursor];
    };
    Lexer.prototype.peekNextChar = function () {
        if (this.cursor + 1 >= this.program.length)
            return "";
        return this.program[this.cursor + 1];
    };
    Lexer.prototype.nextToken = function () {
        var _this = this;
        var token;
        var char = this.getChar();
        switch (this.state) {
            case LexState.ARITHOP:
                switch (char) {
                    case "+":
                        token = new token_1.Token(token_1.TT.ADDOP, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "-":
                        token = new token_1.Token(token_1.TT.SUBOP, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "/":
                        token = new token_1.Token(token_1.TT.DIVOP, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "*":
                        token = new token_1.Token(token_1.TT.MULOP, this.advanceChar(), this.fLine, this.fCol);
                        break;
                }
                break;
            case LexState.LOGICALOP:
                switch (char) {
                    case "<": {
                        token = new token_1.Token(token_1.TT.LESS, char, this.fLine, this.fCol);
                        var next = this.peekNextChar();
                        if (next === ">") {
                            //Avançar twice
                            var lexeme = this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = token_1.TT.NOTEQ;
                        }
                        else if (next === "=") {
                            //Avançar twice
                            var lexeme = this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = token_1.TT.LESSEQ;
                        }
                        else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                    }
                    case ">": {
                        token = new token_1.Token(token_1.TT.GREATER, char, this.fLine, this.fCol);
                        var next = this.peekNextChar();
                        if (next === "=") {
                            //Avançar twice
                            var lexeme = this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = token_1.TT.GREATEREQ;
                        }
                        else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                    }
                    case "=":
                        token = new token_1.Token(token_1.TT.EQ, this.advanceChar(), this.fLine, this.fCol);
                        break;
                }
                break;
            case LexState.DELIMETER:
                switch (char) {
                    case ":":
                        token = new token_1.Token(token_1.TT.COLON, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case ";":
                        token = new token_1.Token(token_1.TT.SEMICOL, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case ",":
                        token = new token_1.Token(token_1.TT.COMMA, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "(":
                        token = new token_1.Token(token_1.TT.LPAR, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case ")":
                        token = new token_1.Token(token_1.TT.RPAR, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "[":
                        token = new token_1.Token(token_1.TT.LBRACK, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case "]":
                        token = new token_1.Token(token_1.TT.RBRACK, this.advanceChar(), this.fLine, this.fCol);
                        break;
                    case ".":
                        token = new token_1.Token(token_1.TT.DOT, char, this.fLine, this.fCol);
                        var next = this.peekNextChar();
                        if (next === ".") {
                            //Avançar twice
                            var lexeme = this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = token_1.TT.DOTDOT;
                        }
                        else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                }
                break;
            case LexState.NUMBER: {
                var start = this.fCol;
                var number_1 = "";
                var buildNumber = function () {
                    while (exports.isDigit(_this.getChar())) {
                        number_1 += _this.advanceChar();
                    }
                };
                buildNumber();
                //Caso for um número decimal
                if (this.getChar() === "." && exports.isDigit(this.peekNextChar())) {
                    number_1 += this.advanceChar() + this.advanceChar();
                    buildNumber();
                    token = new token_1.Token(token_1.TT.FLOAT, number_1, this.fLine, start);
                }
                else {
                    //Caso for inteiro
                    token = new token_1.Token(token_1.TT.INT, number_1, this.fLine, this.fCol);
                }
                break;
            }
            case LexState.STRING: {
                var start = this.fCol;
                var delimeter = this.advanceChar();
                var string = delimeter;
                while (this.getChar() != delimeter) {
                    string += this.advanceChar();
                }
                string += this.advanceChar();
                token = new token_1.Token(token_1.TT.STRING, string, this.fLine, start);
                break;
            }
            case LexState.IDENTIFIER: {
                var identifier = "";
                var start = this.fCol;
                var char_1 = this.getChar();
                while (exports.isDigit(char_1) || exports.isLetter(char_1)) {
                    identifier += this.advanceChar();
                    char_1 = this.getChar();
                }
                token = token_1.Token.fromID(identifier, this.fLine, start);
                break;
            }
            case LexState.EOF:
                token = new token_1.Token(token_1.TT.EOF, "", -1, -1);
                break;
            default:
                throw new Error("Lexema inválido: " + this.program[this.cursor]);
        }
        this.updateState();
        return token;
    };
    return Lexer;
}());
exports.Lexer = Lexer;
