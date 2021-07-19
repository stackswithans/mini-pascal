"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = exports.TT = void 0;
var TT;
(function (TT) {
    TT[TT["ASSIGN"] = 0] = "ASSIGN";
    TT[TT["INTEGER"] = 1] = "INTEGER";
    TT[TT["FLOAT"] = 2] = "FLOAT";
    TT[TT["ID"] = 3] = "ID";
    TT[TT["EQ"] = 4] = "EQ";
    TT[TT["GREATER"] = 5] = "GREATER";
    TT[TT["GREATEREQ"] = 6] = "GREATEREQ";
    TT[TT["NOTEQ"] = 7] = "NOTEQ";
    TT[TT["LESS"] = 8] = "LESS";
    TT[TT["LESSEQ"] = 9] = "LESSEQ";
    TT[TT["ADDOP"] = 10] = "ADDOP";
    TT[TT["SUBOP"] = 11] = "SUBOP";
    TT[TT["MULOP"] = 12] = "MULOP";
    TT[TT["DIVOP"] = 13] = "DIVOP";
    TT[TT["DOT"] = 14] = "DOT";
    TT[TT["DOTDOT"] = 15] = "DOTDOT";
    TT[TT["COLON"] = 16] = "COLON";
    TT[TT["LPAR"] = 17] = "LPAR";
    TT[TT["LBRACE"] = 18] = "LBRACE";
    TT[TT["RBRACE"] = 19] = "RBRACE";
    TT[TT["RPAR"] = 20] = "RPAR";
    TT[TT["COMMA"] = 21] = "COMMA";
    TT[TT["SEMICOL"] = 22] = "SEMICOL";
    TT[TT["DIV"] = 23] = "DIV";
    TT[TT["OR"] = 24] = "OR";
    TT[TT["AND"] = 25] = "AND";
    TT[TT["NOT"] = 26] = "NOT";
    TT[TT["IF"] = 27] = "IF";
    TT[TT["THEN"] = 28] = "THEN";
    TT[TT["ELSE"] = 29] = "ELSE";
    TT[TT["OF"] = 30] = "OF";
    TT[TT["WHILE"] = 31] = "WHILE";
    TT[TT["DO"] = 32] = "DO";
    TT[TT["BEGIN"] = 33] = "BEGIN";
    TT[TT["END"] = 34] = "END";
    TT[TT["READ"] = 35] = "READ";
    TT[TT["WRITE"] = 36] = "WRITE";
    TT[TT["VAR"] = 37] = "VAR";
    TT[TT["ARRAY"] = 38] = "ARRAY";
    TT[TT["PROCEDURE"] = 39] = "PROCEDURE";
    TT[TT["PROGRAM"] = 40] = "PROGRAM";
})(TT = exports.TT || (exports.TT = {}));
const keywords = {
    div: TT.DIV,
    or: TT.OR,
    and: TT.AND,
    if: TT.IF,
    then: TT.THEN,
    else: TT.ELSE,
    of: TT.OF,
    while: TT.WHILE,
    do: TT.DO,
    begin: TT.BEGIN,
    end: TT.END,
    read: TT.READ,
    write: TT.WRITE,
    var: TT.VAR,
    array: TT.ARRAY,
    procedure: TT.PROCEDURE,
    program: TT.PROGRAM,
};
class Token {
    constructor(token, lexeme, line, col) {
        this.token = token;
        this.lexeme = lexeme;
        this.line = line;
        this.col = col;
    }
    equals(other) {
        if (this.line != other.line)
            return false;
        if (this.token != other.token)
            return false;
        return this.lexeme === other.lexeme;
    }
    static fromID(lexeme, line, col) {
        let tType = TT.ID;
        if (keywords.hasOwnProperty(lexeme)) {
            tType = keywords[lexeme];
        }
        return new Token(tType, lexeme, line, col);
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map