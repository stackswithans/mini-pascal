"use strict";
exports.__esModule = true;
exports.Token = exports.TT = void 0;
var TT;
(function (TT) {
    TT["ASSIGN"] = "ASSIGN";
    TT["INT"] = "INT";
    TT["FLOAT"] = "FLOAT";
    TT["ID"] = "ID";
    TT["EQ"] = "EQ";
    TT["GREATER"] = "GREATER";
    TT["GREATEREQ"] = "GREATEREQ";
    TT["NOTEQ"] = "NOTEQ";
    TT["LESS"] = "LESS";
    TT["LESSEQ"] = "LESSEQ";
    TT["ADDOP"] = "ADDOP";
    TT["SUBOP"] = "SUBOP";
    TT["MULOP"] = "MULOP";
    TT["DIVOP"] = "DIVOP";
    TT["DOT"] = "DOT";
    TT["DOTDOT"] = "DOTDOT";
    TT["COLON"] = "COLON";
    TT["LPAR"] = "LPAR";
    TT["LBRACK"] = "LBRACK";
    TT["RBRACK"] = "RBRACK";
    TT["RPAR"] = "RPAR";
    TT["COMMA"] = "COMMA";
    TT["SEMICOL"] = "SEMICOL";
    TT["DIV"] = "DIV";
    TT["OR"] = "OR";
    TT["AND"] = "AND";
    TT["NOT"] = "NOT";
    TT["IF"] = "IF";
    TT["THEN"] = "THEN";
    TT["ELSE"] = "ELSE";
    TT["OF"] = "OF";
    TT["WHILE"] = "WHILE";
    TT["DO"] = "DO";
    TT["BEGIN"] = "BEGIN";
    TT["END"] = "END";
    TT["READ"] = "READ";
    TT["WRITE"] = "WRITE";
    TT["VAR"] = "VAR";
    TT["TRUE"] = "TRUE";
    TT["FALSE"] = "FALSE";
    TT["INTEGER"] = "INTEGER";
    TT["CHAR"] = "CHAR";
    TT["BOOLEAN"] = "BOOLEAN";
    TT["REAL"] = "REAL";
    TT["FUNCTION"] = "FUNCTION";
    TT["ARRAY"] = "ARRAY";
    TT["PROCEDURE"] = "PROCEDURE";
    TT["PROGRAM"] = "PROGRAM";
    TT["STRING"] = "STRING";
    TT["EOF"] = "EOF";
})(TT = exports.TT || (exports.TT = {}));
var keywords = {
    div: TT.DIV,
    or: TT.OR,
    and: TT.AND,
    "if": TT.IF,
    then: TT.THEN,
    "else": TT.ELSE,
    of: TT.OF,
    "while": TT.WHILE,
    "do": TT.DO,
    begin: TT.BEGIN,
    end: TT.END,
    read: TT.READ,
    write: TT.WRITE,
    "var": TT.VAR,
    array: TT.ARRAY,
    procedure: TT.PROCEDURE,
    "function": TT.FUNCTION,
    int: TT.INT,
    integer: TT.INTEGER,
    char: TT.CHAR,
    boolean: TT.BOOLEAN,
    real: TT.REAL,
    "true": TT.TRUE,
    "false": TT.FALSE,
    program: TT.PROGRAM
};
var Token = /** @class */ (function () {
    function Token(token, lexeme, line, col) {
        this.token = token;
        this.lexeme = lexeme;
        this.line = line;
        this.col = col;
    }
    Token.prototype.equals = function (other) {
        if (this.line != other.line)
            return false;
        if (this.token != other.token)
            return false;
        return this.lexeme === other.lexeme;
    };
    Token.fromID = function (lexeme, line, col) {
        var tType = TT.ID;
        if (keywords.hasOwnProperty(lexeme.toLowerCase())) {
            tType = keywords[lexeme.toLowerCase()];
        }
        return new Token(tType, lexeme, line, col);
    };
    return Token;
}());
exports.Token = Token;
