import * as ast from "./ast";
import { TT } from "./token";
import { Ok, Result, isOk } from "./types";

type SemError = { line: number; message: string; col: number };

type SymbolData = { kind: ast.NodeKind; data: ast.NodeData };
type SymbolTable = Record<string, SymbolData>;

type Type = TT.REAL | TT.CHAR | TT.INTEGER;

interface EvalType {
    eType: Type;
    isArray: boolean;
}

interface Scope {
    parent: Scope | null;
    symbols: SymbolTable;
}

const newType = (eType: TT, isArray: boolean) => {
    eType = eType as Type;
    return { result: { eType, isArray } };
};

class Checker {
    scope: Scope = { parent: null, symbols: {} };
    errors: SemError[] = [];

    reportError<T extends ast.NodeData>(message: string, ctx: ast.Node<T>) {
        let errMsg = `Erro semântico (${ctx.line}:${ctx.col}): ${message}.`;
        this.errors.push({ message: errMsg, line: ctx.line, col: ctx.col });
    }

    declareSymbol(id: string, kind: ast.NodeKind, data: ast.NodeData) {
        this.scope.symbols[id] = { kind, data };
    }

    checkBlock(block: ast.Block) {
        const isFunction = (
            node: ast.Node<ast.VarDecl | ast.SubRoutine>
        ): node is ast.Node<ast.SubRoutine> => {
            return node.nodeKind === ast.NodeKind.SubRoutine;
        };
        for (let decl of block.declarations) {
            if (isFunction(decl)) {
                this.check(decl);
            } else {
                this.check(decl);
            }
        }
        for (let stmt of block.statements) {
            this.check(stmt);
        }
    }

    check(node: ast.Node<ast.NodeData>) {
        switch (node.nodeKind) {
            case ast.NodeKind.VarDecl: {
                let varDecl = node as ast.Node<ast.VarDecl>;
                this.checkVarDecl(varDecl);
                break;
            }
            case ast.NodeKind.SubRoutine: {
                let funcDecl = node as ast.Node<ast.SubRoutine>;
                this.checkfuncDecl(funcDecl);
                break;
            }
            case ast.NodeKind.IOStmt: {
                let ioStmt = node as ast.Node<ast.IOStmt>;
                this.checkIOStmt(ioStmt);
                break;
            }
            case ast.NodeKind.Variable: {
                let variable = node as ast.Node<ast.Variable>;
                this.checkVariable(variable);
                break;
            }
            case ast.NodeKind.BinOp:
            case ast.NodeKind.UnaryOp:
            case ast.NodeKind.Call:
            case ast.NodeKind.Literal: {
                let expression = node as ast.Node<ast.Expression>;
                this.checkExpression(expression);
                break;
            }
            case ast.NodeKind.Assign: {
                let { target, expr } = node.data as ast.Assign;
                this.checkExpression(expr);
            }
            default:
                console.log(`Not implement yet`);
        }
    }

    idIsDeclared<T extends ast.NodeData>(
        id: string,
        node: ast.Node<T>,
        message?: string
    ): boolean {
        if (id in this.scope.symbols) {
            if (message === undefined) {
                message = `O identificador '${id}' já foi declarado`;
            }
            this.reportError(message, node);
            return true;
        }
        return false;
    }

    resolveVariable(id: string): SymbolData | null {
        let scope: Scope | null = this.scope;
        while (scope !== null) {
            if (id in scope.symbols) {
                return scope.symbols[id];
            }
            scope = scope.parent;
        }
        return null;
    }

    checkVarDecl(node: ast.Node<ast.VarDecl>, message?: string) {
        let { id } = node.data;
        let idStr = id.lexeme;
        if (this.idIsDeclared(idStr, node, message)) return;
        this.declareSymbol(idStr, node.nodeKind, node.data);
    }

    checkfuncDecl(node: ast.Node<ast.SubRoutine>) {
        //TODO: Assert that functions return a value (also right type)
        //TODO: Assert procedures do not return value;
        let { name, formal_params } = node.data;
        let nameStr = name.lexeme;
        if (this.idIsDeclared(nameStr, node)) return;
        this.declareSymbol(nameStr, node.nodeKind, node.data);
        let funcScope: Scope = { parent: this.scope, symbols: {} };
        this.scope = funcScope;
        //Verify args
        this.declareSymbol(nameStr, ast.NodeKind.SubRoutine, node.data);
        for (let decl of formal_params) {
            let idStr = decl.data.id.lexeme;
            this.checkVarDecl(
                decl,
                `O parâmetro '${idStr}' já foi declarado nesta função`
            );
        }
        this.checkBlock(node.data.block);
        this.scope = funcScope.parent as Scope;
    }

    checkIOStmt(ioStmt: ast.Node<ast.IOStmt>) {
        let args: ast.Node<ast.Variable>[] = ioStmt.data.args;
        for (let arg of args) {
            this.checkVariable(arg);
        }
    }

    checkVariable(variable: ast.Node<ast.Variable>): Result<EvalType> {
        let { id, index } = variable.data;
        let idStr = id.lexeme;
        let data = this.resolveVariable(idStr);
        if (data === null) {
            this.reportError(
                `A variável '${idStr}' não foi declarada`,
                variable
            );
            return {};
        }
        let { typeTok, isArray } = (<ast.VarDecl>(
            (<SymbolData>data).data
        )).varType.data;
        if (index !== undefined && !isArray) {
            this.reportError(
                `A variável '${idStr}' não é um array. Apenas os arrays podem ser acedidos com índices`,
                variable
            );
            return {};
        }
        //TODO: Check if index is a valid int;
        //If the variable is an array access, evalType is the type
        // of the element
        return newType(typeTok.token, index ? false : isArray);
    }

    checkExpression(expr: ast.Node<ast.Expression>): Result<EvalType> {
        switch (expr.nodeKind) {
            case ast.NodeKind.BinOp: {
                //TODO: Check that operands of arit ops are int or float
                //TODO: Check if operand is int or float
                let { op, lhs, rhs } = expr.data as ast.BinOp;
                switch (op.token) {
                    case TT.ADDOP:
                    case TT.SUBOP:
                    case TT.DIV:
                    case TT.DIVOP:
                    case TT.MULOP: {
                        let leftType = this.checkExpression(lhs);
                        let rightType = this.checkExpression(rhs);
                        if (!isOk(leftType) || !isOk(rightType)) {
                            return {};
                        }
                        if (
                            leftType.result.isArray ||
                            rightType.result.isArray
                        ) {
                            this.reportError(
                                "Arrays não podem participar de operações aritméticas",
                                lhs
                            );
                            return {};
                        }
                        let lType = leftType.result.eType;
                        let rType = rightType.result.eType;
                        if (lType == TT.CHAR || rType == TT.CHAR) {
                            this.reportError(
                                `Incompatibilidade entre os operandos do operador '${
                                    op.lexeme
                                }': '${lType.toLowerCase()}' e '${rType.toLowerCase()}'`,
                                lhs
                            );
                            return {};
                        }
                        let eType =
                            lType == TT.REAL || rType == TT.REAL
                                ? TT.REAL
                                : TT.INTEGER;
                        return newType(eType, false);
                    }
                }
                return {};
            }
            case ast.NodeKind.UnaryOp: {
                //TODO: Check if operand is int or float
                let { op, operand } = expr.data as ast.UnaryOp;
                let operandType = this.checkExpression(operand);
                if (!isOk(operandType)) {
                    return {};
                }
                if (
                    operandType.result.eType == TT.CHAR ||
                    operandType.result.isArray
                ) {
                    this.reportError(
                        `O operando do operador '${op.lexeme}' deve ser do tipo 'integer' ou do tipo 'real'`,
                        operand
                    );
                    return {};
                }
                return operandType;
            }
            case ast.NodeKind.Call: {
                //TODO: Check if the callee is a function;
                //TODO: Check arity and assert that args match params;
                return {};
            }
            case ast.NodeKind.Literal: {
                let { tokType } = expr.data as ast.Literal;
                return newType(tokType, false);
            }
            case ast.NodeKind.Variable: {
                return this.checkVariable(expr as ast.Node<ast.Variable>);
            }
            default:
                return {};
        }
    }
}

export function verifyProgram(
    program: ast.Node<ast.Program>
): [boolean, SemError[]] {
    let analyzer = new Checker();
    analyzer.checkBlock(program.data.block);
    return [analyzer.errors.length > 0, analyzer.errors];
}
