import * as ast from "./ast";
import { equal } from "assert";

type SemError = { line: number; message: string; col: number };

type SymbolData = { kind: ast.NodeKind; data: ast.NodeData };
type SymbolTable = Record<string, SymbolData>;

interface Scope {
    parent: Scope | null;
    symbols: SymbolTable;
}

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

    check<T extends ast.NodeData>(node: ast.Node<T>) {
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
        let { name, formal_params } = node.data;
        //TODO: Dedup this code;
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

    checkVariable(variable: ast.Node<ast.Variable>): any {
        let { id } = variable.data;
        let idStr = id.lexeme;
        let data = this.resolveVariable(idStr);
        if (data === null) {
            this.reportError(
                `A variável '${idStr}' não foi declarada`,
                variable
            );
        }
        return;
        let varData = (<SymbolData>data).data as ast.VarDecl;
    }
}

export function verifyProgram(
    program: ast.Node<ast.Program>
): [boolean, SemError[]] {
    let analyzer = new Checker();
    analyzer.checkBlock(program.data.block);
    return [analyzer.errors.length > 0, analyzer.errors];
}
