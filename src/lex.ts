import { Token, TT } from "./token";

enum LexState {
    INITIAL,
    ARITHOP,
    LOGICALOP,
    DELIMETER,
    IDENTIFIER,
    NUMBER,
    STRING,
    EOF,
}

const literals = {
    aritOps: ["+", "-", "*", "/"],
    logicOps: ["<", ">", "="],
    delimeters: ["(", ")", "[", "]", ".", ",", ":", ";"],
};

export const isDigit = (char: string) => {
    let code = char.codePointAt(0) as number;
    return code >= 48 && code <= 57;
};

export const isLetter = (char: string) => {
    let code = char.codePointAt(0) as number;
    return (code >= 97 && code <= 122) || (code >= 65 && code <= 90);
};

export class Lexer {
    private program: string;
    private fLine: number;
    private fCol: number;
    private cursor: number; //Points to the current char
    private state: LexState = LexState.INITIAL;

    public constructor(program: string) {
        this.program = program;
        this.fLine = 1;
        this.fCol = 1;
        this.cursor = 0;
        this.updateState();
    }

    private updateState() {
        if (this.cursor >= this.program.length) {
            this.state = LexState.EOF;
            return;
        }

        let char = this.getChar();
        const whitespace = /\s/;
        //Skip whitespace
        while (whitespace.test(char)) {
            this.advanceChar();
            char = this.getChar();
        }

        if (literals.aritOps.some((value) => char === value)) {
            this.state = LexState.ARITHOP;
        } else if (literals.logicOps.some((value) => char === value)) {
            this.state = LexState.LOGICALOP;
        } else if (literals.delimeters.some((value) => char === value)) {
            this.state = LexState.DELIMETER;
        } else if (isDigit(char)) {
            this.state = LexState.NUMBER;
        } else if (isLetter(char)) {
            this.state = LexState.IDENTIFIER;
        } else if (char === "'" || char === '"') {
            this.state = LexState.STRING;
        } else if (char == "") {
            this.state = LexState.EOF;
        } else {
            console.dir(char);
            throw new Error("Lexema desconhecido: " + char);
        }
    }

    private advanceChar(): string {
        if (this.cursor >= this.program.length) {
            return "";
        }
        let char = this.program[this.cursor];
        if (char === "\n") {
            this.fCol = 1;
            this.fLine += 1;
        } else {
            this.fCol += 1;
        }
        this.cursor += 1;
        return char;
    }

    private getChar(): string {
        if (this.cursor >= this.program.length) {
            return "";
        }
        return this.program[this.cursor];
    }

    private peekNextChar(): string {
        if (this.cursor + 1 >= this.program.length) return "";
        return this.program[this.cursor + 1];
    }

    public nextToken(): Token {
        let token: Token;
        token = new Token(TT.EOF, "", -1, -1);
        let char = this.getChar();
        switch (this.state) {
            case LexState.ARITHOP:
                switch (char) {
                    case "+":
                        token = new Token(
                            TT.ADDOP,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "-":
                        token = new Token(
                            TT.SUBOP,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "/":
                        token = new Token(
                            TT.DIVOP,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "*":
                        token = new Token(
                            TT.MULOP,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                }
                break;
            case LexState.LOGICALOP:
                switch (char) {
                    case "<": {
                        token = new Token(TT.LESS, char, this.fLine, this.fCol);
                        let next = this.peekNextChar();
                        if (next === ">") {
                            //Avançar twice
                            let lexeme =
                                this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = TT.NOTEQ;
                        } else if (next === "=") {
                            //Avançar twice
                            let lexeme =
                                this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = TT.LESSEQ;
                        } else {
                            token.lexeme = this.advanceChar();
                        }

                        break;
                    }
                    case ">": {
                        token = new Token(
                            TT.GREATER,
                            char,
                            this.fLine,
                            this.fCol
                        );
                        let next = this.peekNextChar();
                        if (next === "=") {
                            //Avançar twice
                            let lexeme =
                                this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = TT.GREATEREQ;
                        } else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                    }
                    case "=":
                        token = new Token(
                            TT.EQ,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                }
                break;
            case LexState.DELIMETER:
                switch (char) {
                    case ":": {
                        token = new Token(
                            TT.COLON,
                            char,
                            this.fLine,
                            this.fCol
                        );
                        let next = this.peekNextChar();
                        if (next === "=") {
                            //Avançar twice
                            let lexeme =
                                this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = TT.ASSIGN;
                        } else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                    }
                    case ";":
                        token = new Token(
                            TT.SEMICOL,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case ",":
                        token = new Token(
                            TT.COMMA,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "(":
                        token = new Token(
                            TT.LPAR,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case ")":
                        token = new Token(
                            TT.RPAR,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "[":
                        token = new Token(
                            TT.LBRACK,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case "]":
                        token = new Token(
                            TT.RBRACK,
                            this.advanceChar(),
                            this.fLine,
                            this.fCol
                        );
                        break;
                    case ".":
                        token = new Token(TT.DOT, char, this.fLine, this.fCol);
                        let next = this.peekNextChar();
                        if (next === ".") {
                            //Avançar twice
                            let lexeme =
                                this.advanceChar() + this.advanceChar();
                            token.lexeme = lexeme;
                            token.token = TT.DOTDOT;
                        } else {
                            token.lexeme = this.advanceChar();
                        }
                        break;
                }
                break;
            case LexState.NUMBER: {
                let start = this.fCol;
                let number = "";
                const buildNumber = () => {
                    while (isDigit(this.getChar())) {
                        number += this.advanceChar();
                    }
                };
                buildNumber();
                //Caso for um número decimal
                if (this.getChar() === "." && isDigit(this.peekNextChar())) {
                    number += this.advanceChar() + this.advanceChar();
                    buildNumber();
                    token = new Token(TT.FLOAT, number, this.fLine, start);
                } else {
                    //Caso for inteiro
                    token = new Token(TT.INT, number, this.fLine, this.fCol);
                }
                break;
            }
            case LexState.STRING: {
                let start = this.fCol;
                const delimeter = this.advanceChar();
                let string = delimeter;
                while (this.getChar() != delimeter) {
                    string += this.advanceChar();
                }
                string += this.advanceChar();
                token = new Token(TT.STRING, string, this.fLine, start);
                break;
            }
            case LexState.IDENTIFIER: {
                let identifier = "";
                let start = this.fCol;
                let char = this.getChar();
                while (isDigit(char) || isLetter(char)) {
                    identifier += this.advanceChar();
                    char = this.getChar();
                }
                token = Token.fromID(identifier, this.fLine, start);
                break;
            }
            case LexState.EOF:
                token = new Token(TT.EOF, "", -1, -1);
                break;
            default:
                throw new Error(
                    "Lexema inválido: " + this.program[this.cursor]
                );
        }
        this.updateState();
        return token;
    }
}
