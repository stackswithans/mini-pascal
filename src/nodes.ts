import { Token } from "./token";

enum NodeKind {
    Program,
    Block,
    VarDecl,
    SubRoutine,
    Statement,
    Expression,
}

type NodeData = Program | Block | VarDecl | SubRoutine | Statement | Expression;

export interface Node<T extends NodeData> {
    nodeKind: NodeKind;
    line: number;
    col: number;
    data: T;
}

export interface Program {
    id: Token;
    block: Node<Block>;
}

export interface Block {
    declarations: Array<Node<VarDecl> | Node<SubRoutine>>;
    statements: Node<Statement>[];
}

export type ArrayRange = { start: Token; end: Token };

export interface Type {
    typeTok: Token;
    isArray: boolean;
    range?: Node<ArrayRange>;
}

export interface VarDecl {
    id: Token;
    varType: Node<Type>;
}

export enum RoutineType {
    FUNCTION = "Function",
    PROCEDURE = "Procedure",
}

export interface SubRoutine {
    routineType: RoutineType;
    name: Token;
    formal_params: Node<VarDecl>[];
    block: Node<Block>;
    returnType: Node<Type> | null;
}

export enum StmtType {
    IOSTMT,
    ASSIGN,
    CALL,
}

export interface Expression {}

export interface Variable {
    id: Token;
    index?: Node<Expression>;
}

export interface IOStmt {
    ioStmt: Token;
    args: Node<Variable>[];
}

export interface Assign {
    target: Node<Variable>;
    expr: Node<Expression>;
}

export interface Call {
    callee: Node<Variable>;
    args: Node<Expression>[];
}

export type StmtMeta = Variable | IOStmt | Assign | Call;

export interface Statement {
    stmtType: StmtType;
    meta: Node<StmtMeta>;
}

export function inspect<T extends NodeData>(node: Node<T>) {
    const stringifyType = (typeNode: Node<Type>) =>
        typeNode.data.isArray ? "[]" : "";
    switch (node.nodeKind) {
        case NodeKind.Program: {
            let { id, block } = node.data as Program;
            console.log("Program: " + id.lexeme + "\n");
            inspect(block);
            break;
        }
        case NodeKind.Block: {
            let { declarations, statements } = node.data as Block;
            for (let decl of declarations) {
                if (decl.nodeKind === NodeKind.VarDecl) {
                    inspect(decl as Node<VarDecl>);
                } else {
                    inspect(decl as Node<SubRoutine>);
                }
            }
            for (let stmt of statements) {
                inspect(stmt);
            }
            break;
        }
        case NodeKind.VarDecl: {
            let { id, varType } = node.data as VarDecl;
            console.log(`Variable Declaration: 
                identifier: ${id.lexeme}
                type: ${varType.data.typeTok.lexeme} ${stringifyType(varType)}
            `);
            break;
        }
        case NodeKind.SubRoutine: {
            let {
                returnType,
                routineType,
                name,
                formal_params,
            } = node.data as SubRoutine;
            let returns: string =
                routineType === RoutineType.FUNCTION
                    ? stringifyType(returnType as Node<Type>)
                    : "";

            console.log(`${routineType}:
                        Nome: ${name.lexeme}
                        Parâmetros: ${formal_params.length}
                        Retorna: ${returns}
                        `);
            break;
        }
        case NodeKind.Statement: {
            let { stmtType, meta } = node.data as Statement;
            let message: string;
            switch (stmtType) {
                case StmtType.IOSTMT:
                    let ioData = meta.data as IOStmt;
                    message = `Statement:
                    ${ioData.ioStmt.token}`;
                    break;
                case StmtType.ASSIGN:
                    let { target } = meta.data as Assign;
                    message = `Statement:
                    ${target.data.id.lexeme}`;
                    break;
                case StmtType.CALL:
                    let { callee } = meta.data as Call;
                    message = `Statement:
                    ${callee.data.id.lexeme}`;
                    break;
            }
            console.log(message);
            break;
        }
    }
}
