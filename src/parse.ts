import { Lexer } from "./lex";
import { Token, TT } from "./token";
import * as ast from "./nodes";

type ParseError = { message: string; line: number; col: number };

export class Parser {
    private lookahead: Token;
    private lexer: Lexer;
    private errors: ParseError[] = [];

    constructor(source: string) {
        this.lexer = new Lexer(source);
        this.lookahead = this.lexer.nextToken();
    }

    private throwError(message: string, context: Token) {
        const errMsg = `Erro sintático\
                      (${context.line}:${context.col}):\
                      ${message}`;
        console.error(errMsg);
        throw new Error(errMsg);
    }

    private consume(tokenT: TT): Token {
        if (!(this.lookahead.token === tokenT)) {
            this.throwError(
                `Expected ${tokenT} but got ${this.lookahead.token}`,
                this.lookahead
            );
        }
        let old = this.lookahead;
        this.lookahead = this.lexer.nextToken();
        return old;
    }

    private match(tokenT: TT): boolean {
        return this.lookahead.token === tokenT;
    }

    public parse(): ast.Program {
        return this.program();
    }

    private program(): ast.Program {
        this.consume(TT.PROGRAM);
        let id = this.consume(TT.ID);
        this.consume(TT.SEMICOL);
        let block = this.block();
        this.consume(TT.DOT);
        return new ast.Program(id, block);
    }

    private block(): ast.Block {
        let block = new ast.Block();
        if (this.match(TT.VAR)) {
            block.pushInstructions(this.var_decl_sect());
        }
        if (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
            block.pushInstructions(this.sub_decl_sect());
        }
        block.pushInstructions(this.compound_stmt());
        return block;
    }

    private var_decl_sect(): ast.VarDecl[] {
        let declarations = [];
        this.consume(TT.VAR);
        declarations.push(this.var_decl());
        this.consume(TT.SEMICOL);
        while (this.match(TT.ID)) {
            declarations.push(this.var_decl());
            this.consume(TT.SEMICOL);
        }
        return declarations;
    }

    private var_decl(): ast.VarDecl {
        let id = this.consume(TT.ID);
        this.consume(TT.COLON);
        let sem_type = this.sem_type();
        return new ast.VarDecl(id, sem_type);
    }

    private sem_type(): ast.Type {
        if (
            this.match(TT.CHAR) ||
            this.match(TT.INTEGER) ||
            this.match(TT.REAL)
        ) {
            return new ast.Type(this.simple_type());
        }
        let tok = this.consume(TT.ARRAY);
        this.consume(TT.LBRACK);
        let range = this.index_range();
        this.consume(TT.RBRACK);
        this.consume(TT.OF);
        return new ast.ArrayType(this.simple_type(), range);
    }

    private index_range(): ast.ArrayRange {
        let start = this.consume(TT.INT);
        this.consume(TT.DOTDOT);
        let end = this.consume(TT.INT);
        return { start, end };
    }

    private simple_type(): Token {
        switch (this.lookahead.token) {
            case TT.CHAR:
                return this.consume(TT.CHAR);
            case TT.INTEGER:
                return this.consume(TT.INTEGER);
            case TT.REAL:
                return this.consume(TT.REAL);
            default:
                this.throwError("Tipo de dados inválido", this.lookahead);
                return this.lookahead;
        }
    }
    private sub_decl_sect(): ast.SubRoutine[] {
        let subroutines: ast.SubRoutine[] = [];
        while (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
            if (this.match(TT.PROCEDURE)) {
                subroutines.push(this.proc_decl());
            } else {
                subroutines.push(this.func_decl());
            }
            this.consume(TT.SEMICOL);
        }
        return subroutines;
    }

    private proc_decl(): ast.SubRoutine {
        this.consume(TT.PROCEDURE);
        let id = this.consume(TT.ID);
        let formal_params: ast.VarDecl[] = [];
        if (this.match(TT.LPAR)) {
            formal_params = this.formal_params();
        }
        this.consume(TT.SEMICOL);
        let block = this.block();
        return new ast.SubRoutine(
            ast.RoutineType.PROCEDURE,
            id,
            formal_params,
            block,
            null
        );
    }

    private func_decl(): ast.SubRoutine {
        this.consume(TT.FUNCTION);
        let id = this.consume(TT.ID);
        let formal_params: ast.VarDecl[] = [];
        if (this.match(TT.LPAR)) {
            formal_params = this.formal_params();
        }
        this.consume(TT.COLON);
        let returnType = this.sem_type();
        this.consume(TT.SEMICOL);
        let block = this.block();
        return new ast.SubRoutine(
            ast.RoutineType.FUNCTION,
            id,
            formal_params,
            block,
            returnType
        );
    }

    private formal_params(): ast.VarDecl[] {
        let params: ast.VarDecl[] = [];
        this.consume(TT.LPAR);
        params.push(this.var_decl());
        while (this.match(TT.SEMICOL)) {
            this.consume(TT.SEMICOL);
            params.push(this.var_decl());
        }
        this.consume(TT.RPAR);
        return params;
    }

    private compound_stmt(): ast.Statement[] {
        const statements: ast.Statement[] = [];
        this.consume(TT.BEGIN);
        statements.push(this.statement());
        while (this.match(TT.SEMICOL)) {
            this.consume(TT.SEMICOL);
            statements.push(this.statement());
        }
        this.consume(TT.END);
        return statements;
    }

    private statement(): ast.Statement {
        if (this.match(TT.ID) || this.match(TT.READ) || this.match(TT.WRITE)) {
            return this.simple_stmt();
        } else {
            return this.struct_stmt();
        }
    }

    private simple_stmt(): ast.Statement {
        if (this.match(TT.ID)) {
            const target = this.variable();
            if (this.match(TT.ASSIGN)) {
                let token = this.consume(TT.ASSIGN);
                return new ast.Statement(ast.StmtType.ASSIGN, token, {
                    target,
                    expr: this.expression(),
                });
            } else if (this.match(TT.LPAR)) {
                if ("index" in target) {
                    this.throwError(
                        "Este identificador não é invocável",
                        target.id
                    );
                }
                this.consume(TT.LPAR);
                const args = this.formal_args();
                this.consume(TT.RPAR);
                return new ast.Statement(ast.StmtType.CALL, target.id, {
                    callee: target,
                    args,
                });
            } else {
                return new ast.Statement(ast.StmtType.CALL, target.id, {
                    callee: target,
                    args: [],
                });
            }
        } else if (this.match(TT.READ) || this.match(TT.WRITE)) {
            let ioStmt: Token = this.consume(this.lookahead.token);
            let args: ast.Variable[] = this.io_args();
            return new ast.Statement(ast.StmtType.IOSTMT, ioStmt, {
                ioStmt,
                args,
            });
        } else {
            this.throwError("Início de instrução inválido", this.lookahead);
            return new ast.Statement(ast.StmtType.IOSTMT, this.lookahead, {
                id: this.lookahead,
            });
        }
    }

    private struct_stmt(): ast.Statement {
        return new ast.Statement(ast.StmtType.CALL, this.lookahead, {
            id: this.lookahead,
        });
    }

    private io_args(): ast.Variable[] {
        const variables: ast.Variable[] = [];
        this.consume(TT.LPAR);
        variables.push(this.variable());
        while (this.match(TT.COMMA)) {
            this.consume(TT.COMMA);
            variables.push(this.variable());
        }
        this.consume(TT.RPAR);
        return variables;
    }
    private variable(): ast.Variable {
        const id = this.consume(TT.ID);
        if (!this.match(TT.LBRACK)) {
            return { id };
        }
        this.consume(TT.LBRACK);
        const index = this.expression();
        this.consume(TT.RBRACK);
        return { id, index };
    }

    private formal_args(): ast.Expression[] {
        return [];
    }

    private expression(): ast.Expression {
        return new ast.Expression();
    }
}
