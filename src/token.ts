export enum TT {
    ASSIGN,
    INTEGER,
    FLOAT,
    ID,
    EQ,
    GREATER,
    GREATEREQ,
    NOTEQ,
    LESS,
    LESSEQ,
    ADDOP,
    SUBOP,
    MULOP,
    DIVOP,
    DOT,
    DOTDOT,
    COLON,
    LPAR,
    LBRACE,
    RBRACE,
    RPAR,
    COMMA,
    SEMICOL,
    DIV,
    OR,
    AND,
    NOT,
    IF,
    THEN,
    ELSE,
    OF,
    WHILE,
    DO,
    BEGIN,
    END,
    READ,
    WRITE,
    VAR,
    ARRAY,
    PROCEDURE,
    PROGRAM,
}

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

export class Token {
    token: TT;
    lexeme: string;
    line: number;
    col: number;

    public constructor(token: TT, lexeme: string, line: number, col: number) {
        this.token = token;
        this.lexeme = lexeme;
        this.line = line;
        this.col = col;
    }

    public equals(other: Token): boolean {
        if (this.line != other.line) return false;
        if (this.token != other.token) return false;
        return this.lexeme === other.lexeme;
    }

    public static fromID(lexeme: string, line: number, col: number): Token {
        let tType = TT.ID;
        if (keywords.hasOwnProperty(lexeme)) {
            type type_index = keyof typeof keywords;
            tType = keywords[lexeme as type_index];
        }
        return new Token(tType, lexeme, line, col);
    }
}
