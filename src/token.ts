export enum TT {
    ASSIGN = "ASSIGN",
    INT = "INT",
    FLOAT = "FLOAT",
    ID = "ID",
    EQ = "EQ",
    GREATER = "GREATER",
    GREATEREQ = "GREATEREQ",
    NOTEQ = "NOTEQ",
    LESS = "LESS",
    LESSEQ = "LESSEQ",
    ADDOP = "ADDOP",
    SUBOP = "SUBOP",
    MULOP = "MULOP",
    DIVOP = "DIVOP",
    DOT = "DOT",
    DOTDOT = "DOTDOT",
    COLON = "COLON",
    LPAR = "LPAR",
    LBRACK = "LBRACK",
    RBRACK = "RBRACK",
    RPAR = "RPAR",
    COMMA = "COMMA",
    SEMICOL = "SEMICOL",
    DIV = "DIV",
    OR = "OR",
    AND = "AND",
    NOT = "NOT",
    IF = "IF",
    THEN = "THEN",
    ELSE = "ELSE",
    OF = "OF",
    WHILE = "WHILE",
    DO = "DO",
    BEGIN = "BEGIN",
    END = "END",
    READ = "READ",
    WRITE = "WRITE",
    VAR = "VAR",
    TRUE = "TRUE",
    FALSE = "FALSE",
    INTEGER = "INTEGER",
    CHAR = "CHAR",
    BOOLEAN = "BOOLEAN",
    REAL = "REAL",
    FUNCTION = "FUNCTION",
    ARRAY = "ARRAY",
    PROCEDURE = "PROCEDURE",
    PROGRAM = "PROGRAM",
    STRING = "STRING",
    EOF = "EOF",
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
    function: TT.FUNCTION,
    int: TT.INT,
    integer: TT.INTEGER,
    char: TT.CHAR,
    boolean: TT.BOOLEAN,
    real: TT.REAL,
    true: TT.TRUE,
    false: TT.FALSE,
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
        if (keywords.hasOwnProperty(lexeme.toLowerCase())) {
            type type_index = keyof typeof keywords;
            tType = keywords[lexeme.toLowerCase() as type_index];
        }
        return new Token(tType, lexeme, line, col);
    }
}
