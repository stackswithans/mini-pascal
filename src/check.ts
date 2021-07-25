import * as ast from "./ast";

type SemError = { line: number; message: string; col: number };

type SymbolData = { kind: ast.NodeKind; data: ast.NodeData };
type Symbol = Record<string, SymbolData>;

interface Scope {
    parent: Scope | null;
    symbols: Symbol;
}

class Checker {
    scope: Scope = { parent: null, symbols: {} };
    errors: SemError[] = [];

    reportError<T extends ast.NodeData>(message: string, ctx: ast.Node<T>) {
        let errMsg = `Erro semântico (${ctx.line}:${ctx.col}): ${message}.`;
        this.errors.push({ message: errMsg, line: ctx.line, col: ctx.col });
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
        }
    }

    checkVarDecl(node: ast.Node<ast.VarDecl>) {
        let { id, varType } = node.data;
        let idStr = id.lexeme;
        //Check if already
        if (idStr in this.scope.symbols) {
            this.reportError("Este identificador já foi declarado", node);
        }
        this.scope.symbols[idStr] = { kind: node.nodeKind, data: node.data };
    }
}

export function verifyProgram(
    program: ast.Node<ast.Program>
): [boolean, SemError[]] {
    let analyzer = new Checker();
    analyzer.checkBlock(program.data.block);
    return [analyzer.errors.length > 0, analyzer.errors];
}
