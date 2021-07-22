import { Token } from "./token";

class Node {
    token: Token;
    line: number;
    col: number;

    constructor(token: Token) {
        this.line = token.line;
        this.col = token.col;
        this.token = token;
    }

    inspect() {}
}

export class Program extends Node {
    id: Token;
    block: Block;

    constructor(id: Token, block: Block) {
        super(id);
        this.id = id;
        this.block = block;
    }

    inspect() {
        console.log("Program: " + this.id.lexeme + "\n");
        this.block.inspect();
    }
}

export class Block {
    instructions: Node[] = [];

    pushInstructions(instructions: Node[]) {
        this.instructions = [...this.instructions, ...instructions];
    }

    inspect() {
        for (let inst of this.instructions) {
            inst.inspect();
        }
    }
}

export class Type extends Node {
    typeTok: Token;

    constructor(typeTok: Token) {
        super(typeTok);
        this.typeTok = typeTok;
    }

    string(): string {
        return this.typeTok.lexeme;
    }
}

export type ArrayRange = { start: Token; end: Token };

export class ArrayType extends Type {
    range: ArrayRange;

    constructor(typeTok: Token, range: ArrayRange) {
        super(typeTok);
        this.range = range;
    }

    string(): string {
        return `${super.string()}[]`;
    }
}

export class VarDecl extends Node {
    id: Token;
    varType: Type;

    constructor(id: Token, varType: Type) {
        super(id);
        this.id = id;
        this.varType = varType;
    }

    inspect() {
        console.log(`Variable Declaration: 
            identifier: ${this.id.lexeme}
            type: ${this.varType.string()}
        `);
    }
}

export enum RoutineType {
    FUNCTION = "Function",
    PROCEDURE = "Procedure",
}

export class SubRoutine extends Node {
    routineType: RoutineType;
    name: Token;
    formal_params: VarDecl[];
    block: Block;
    returnType: Type | null;

    constructor(
        routineType: RoutineType,
        name: Token,
        formal_params: VarDecl[],
        block: Block,
        returnType: Type | null
    ) {
        super(name);
        this.routineType = routineType;
        this.name = name;
        this.formal_params = formal_params;
        this.block = block;
        this.returnType = returnType;
    }

    inspect() {
        let returnType: string =
            this.routineType === RoutineType.FUNCTION
                ? (this.returnType as Type).string()
                : "";

        console.log(`${this.routineType}:
                    Nome: ${this.name.lexeme}
                    Parâmetros: ${this.formal_params.length}
                    Retorna: ${returnType}
                    `);
    }
}

export enum StmtType {
    IOSTMT,
    ASSIGN,
    CALL,
}

export class Expression {}

export interface Variable {
    id: Token;
    index?: Expression;
}

export interface IOStmt {
    ioStmt: Token;
    args: Variable[];
}

export interface Assign {
    target: Variable;
    expr: Expression;
}

export interface Call {
    callee: Variable;
    args: Expression[];
}

export type StmtMeta = Variable | IOStmt | Assign | Call;

export class Statement extends Node {
    stmtType: StmtType;
    meta: StmtMeta;

    constructor(stmtType: StmtType, token: Token, meta: StmtMeta) {
        super(token);
        this.stmtType = stmtType;
        this.meta = meta;
    }

    inspect() {
        let message: string;
        switch (this.stmtType) {
            case StmtType.IOSTMT:
                let ioData = this.meta as IOStmt;
                message = `Statement:
                ${ioData.ioStmt.token}`;
                break;
            case StmtType.ASSIGN:
                let { target, expr } = this.meta as Assign;
                message = `Statement:
                ${target.id.lexeme}`;
                break;
            case StmtType.CALL:
                let { callee } = this.meta as Call;
                message = `Statement:
                ${callee.id.lexeme}`;
                break;
        }
        console.log(message);
    }
}
