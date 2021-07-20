import { Token, TT } from "./token";

class Node {
    line: number;
    col: number;

    constructor(token: Token) {
        this.line = token.line;
        this.col = token.col;
    }
}

export class Program extends Node {
    id: Token;
    block: Block;

    constructor(id: Token, block: Block) {
        super(id);
        this.id = id;
        this.block = block;
    }
}

export class Block {
    instructions: Node[] = [];
    constructor() {}

    pushInstructions(instructions: Node[]) {
        this.instructions = [...this.instructions, ...instructions];
    }
}

export class Type extends Node {
    typeTok: Token;

    constructor(typeTok: Token) {
        super(typeTok);
        this.typeTok = typeTok;
    }
}

export type ArrayRange = { start: Token; end: Token };

export class ArrayType extends Node {
    token: Token;
    simpleType: Type;
    range: ArrayRange;

    constructor(token: Token, range: ArrayRange, simpleType: Type) {
        super(token);
        this.token = token;
        this.simpleType = simpleType;
        this.range = range;
    }
}

export class VarDecl extends Node {
    id: Token;
    varType: ArrayType | Type;

    constructor(id: Token, varType: ArrayType | Type) {
        super(id);
        this.id = id;
        this.varType = varType;
    }
}
