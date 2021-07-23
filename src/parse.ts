import { Lexer } from "./lex";
import { Token, TT } from "./token";
import * as ast from "./ast";

export type ParseError = { message: string; line: number; col: number };

enum ParseSection {
    VarDecl,
    SubRDecl,
    Stmt,
}

function newNode<T extends ast.NodeData>(
    token: Token,
    nodeKind: ast.NodeKind,
    data: T
) {
    return {
        line: token.line,
        col: token.col,
        nodeKind,
        data,
    };
}

const typeError = "Esperava-se um tipo de dados: char, int, real";

export class Parser {
    private lookahead: Token;
    private lexer: Lexer;
    private errors: ParseError[] = [];

    constructor(source: string) {
        this.lexer = new Lexer(source);
        this.lookahead = this.lexer.nextToken();
    }

    private throwError(message: string, context: Token) {
        const errMsg = `Erro sintático: (${context.line}:${context.col}): ${message}`;
        let error = {
            message: errMsg,
            line: context.line,
            col: context.col,
        };
        this.errors.push(error);
        throw error;
    }

    private consume(
        tokenT: TT,
        message: string = "",
        context: Token | null = null
    ): Token {
        if (!(this.lookahead.token === tokenT)) {
            let errMsg =
                message !== ""
                    ? message
                    : `Esperava-se o token ${tokenT} mas recebeu '${this.lookahead.lexeme}'`;
            let errContext = context === null ? this.lookahead : context;
            this.throwError(errMsg, errContext);
        }
        let old = this.lookahead;
        this.lookahead = this.lexer.nextToken();
        return old;
    }

    private match(tokenT: TT): boolean {
        return this.lookahead.token === tokenT;
    }

    private sychronize(section: ParseSection): boolean {
        while (!this.match(TT.EOF)) {
            switch (section) {
                case ParseSection.VarDecl:
                    if (
                        this.match(TT.PROCEDURE) ||
                        this.match(TT.FUNCTION) ||
                        this.match(TT.BEGIN)
                    ) {
                        return false;
                    } else if (this.match(TT.SEMICOL)) {
                        this.consume(TT.SEMICOL);
                        if (!this.match(TT.ID)) continue;
                        return true;
                    }
                    this.consume(this.lookahead.token);
                    continue;
                case ParseSection.SubRDecl:
                    if (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
                        return true;
                    } else if (this.match(TT.SEMICOL)) {
                        this.consume(TT.SEMICOL);
                        let retry =
                            this.match(TT.PROCEDURE) || this.match(TT.FUNCTION);
                        return retry ? true : false;
                    }
                    this.consume(this.lookahead.token);
                    continue;
                case ParseSection.Stmt:
                    if (
                        this.match(TT.READ) ||
                        this.match(TT.WRITE) ||
                        this.match(TT.ID) ||
                        this.match(TT.SEMICOL)
                    ) {
                        return true;
                    }
                    this.consume(this.lookahead.token);
                    continue;
            }
        }
        return false;
    }

    private callOrSync<T extends ast.Node<ast.NodeData>[]>(
        section: ParseSection,
        fn: () => T,
        errValue: T
    ): T {
        fn = fn.bind(this);
        try {
            return fn();
        } catch (err) {
            let retry: boolean = this.sychronize(section);
            return retry ? fn() : errValue;
        }
    }

    public parse(): [ast.Node<ast.Program> | null, ParseError[]] {
        try {
            return [this.program(), this.errors];
        } catch (err) {
            return [null, this.errors];
        }
    }

    private program(): ast.Node<ast.Program> {
        this.consume(TT.PROGRAM);
        let id = this.consume(TT.ID);
        this.consume(TT.SEMICOL);
        let block = this.block();
        this.consume(TT.DOT);
        return newNode(id, ast.NodeKind.Program, { id, block });
    }

    private block(): ast.Block {
        let declarations = [];
        if (this.match(TT.VAR)) {
            this.consume(TT.VAR);
            declarations.push(
                ...this.callOrSync(ParseSection.VarDecl, this.var_decl_sect, [])
            );
        }
        if (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
            declarations.push(
                ...this.callOrSync(
                    ParseSection.SubRDecl,
                    this.sub_decl_sect,
                    []
                )
            );
        }
        let statements = this.callOrSync(
            ParseSection.Stmt,
            this.compound_stmt,
            []
        );
        return { declarations, statements };
    }

    private var_decl_sect(): ast.Node<ast.VarDecl>[] {
        let decl = this.var_decl();
        let declarations = [newNode(decl.id, ast.NodeKind.VarDecl, decl)];
        this.consume(TT.SEMICOL);
        while (this.match(TT.ID)) {
            let decl = this.var_decl();
            declarations.push(newNode(decl.id, ast.NodeKind.VarDecl, decl));
            this.consume(TT.SEMICOL);
        }
        return declarations;
    }

    private var_decl(): ast.VarDecl {
        let id = this.consume(TT.ID);
        this.consume(TT.COLON);
        let varType = this.sem_type();
        return { id, varType };
    }

    private sem_type(): ast.Node<ast.Type> {
        if (
            this.match(TT.CHAR) ||
            this.match(TT.INTEGER) ||
            this.match(TT.REAL)
        ) {
            let typeTok = this.simple_type();
            return newNode(typeTok, ast.NodeKind.Type, {
                typeTok,
                isArray: false,
            });
        }
        let tok = this.consume(TT.ARRAY, typeError);
        this.consume(TT.LBRACK);
        let range = this.index_range();
        this.consume(TT.RBRACK);
        this.consume(TT.OF);
        let typeTok = this.simple_type();
        return newNode(tok, ast.NodeKind.Type, {
            typeTok,
            isArray: true,
            range,
        });
    }

    private index_range(): ast.Node<ast.ArrayRange> {
        let start = this.consume(TT.INT);
        this.consume(TT.DOTDOT);
        let end = this.consume(TT.INT);
        return newNode(start, ast.NodeKind.ArrayRange, { start, end });
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
                this.throwError(typeError, this.lookahead);
                return this.lookahead;
        }
    }
    private sub_decl_sect(): ast.Node<ast.SubRoutine>[] {
        let subroutines = [];
        while (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
            if (this.match(TT.PROCEDURE)) {
                let routine = this.proc_decl();
                subroutines.push(
                    newNode(routine.name, ast.NodeKind.SubRoutine, routine)
                );
            } else {
                let routine = this.func_decl();
                subroutines.push(
                    newNode(routine.name, ast.NodeKind.SubRoutine, routine)
                );
            }
            this.consume(TT.SEMICOL);
        }
        return subroutines;
    }

    private proc_decl(): ast.SubRoutine {
        this.consume(TT.PROCEDURE);
        let id = this.consume(TT.ID);
        let formal_params: ast.Node<ast.VarDecl>[] = [];
        if (this.match(TT.LPAR)) {
            formal_params = this.formal_params();
        }
        this.consume(TT.SEMICOL);
        let block = this.block();
        return {
            routineType: ast.RoutineType.PROCEDURE,
            name: id,
            formal_params,
            block,
            returnType: null,
        };
    }

    private func_decl(): ast.SubRoutine {
        this.consume(TT.FUNCTION);
        let id = this.consume(TT.ID);
        let formal_params: ast.Node<ast.VarDecl>[] = [];
        if (this.match(TT.LPAR)) {
            formal_params = this.formal_params();
        }
        this.consume(TT.COLON);
        let returnType = this.sem_type();
        this.consume(TT.SEMICOL);
        let block = this.block();
        return {
            routineType: ast.RoutineType.PROCEDURE,
            name: id,
            formal_params,
            block,
            returnType,
        };
    }

    private formal_params(): ast.Node<ast.VarDecl>[] {
        let argErr =
            "Os argumentos de uma subrotina devem ser delimitados por parêntesis";
        let params = [];
        this.consume(TT.LPAR, argErr);
        let decl = this.var_decl();
        params.push(newNode(decl.id, ast.NodeKind.VarDecl, decl));
        while (this.match(TT.SEMICOL)) {
            this.consume(TT.SEMICOL);
            let decl = this.var_decl();
            params.push(newNode(decl.id, ast.NodeKind.VarDecl, decl));
        }
        this.consume(TT.RPAR, argErr);
        return params;
    }

    private compound_stmt(): ast.Node<ast.Statement>[] {
        const statements = [];
        this.consume(TT.BEGIN);
        statements.push(this.statement());
        while (this.match(TT.SEMICOL)) {
            this.consume(TT.SEMICOL);
            statements.push(this.statement());
        }
        this.consume(TT.END);
        return statements;
    }

    private statement(): ast.Node<ast.Statement> {
        if (this.match(TT.ID) || this.match(TT.READ) || this.match(TT.WRITE)) {
            return this.simple_stmt();
        } else {
            return this.struct_stmt();
        }
    }

    private simple_stmt(): ast.Node<ast.Statement> {
        if (this.match(TT.ID)) {
            let variable = this.variable();
            const target = newNode(
                variable.id,
                ast.NodeKind.Variable,
                variable
            );

            if (this.match(TT.ASSIGN)) {
                let token = this.consume(TT.ASSIGN);
                return newNode(token, ast.NodeKind.Assign, {
                    target,
                    expr: this.expression(),
                });
            } else if (this.match(TT.LPAR)) {
                if ("index" in target) {
                    this.throwError(
                        "Este identificador não é invocável",
                        variable.id
                    );
                }
                this.consume(TT.LPAR);
                const args = this.formal_args();
                this.consume(TT.RPAR);
                return newNode(variable.id, ast.NodeKind.Call, {
                    callee: target,
                    args,
                });
            } else {
                return target;
            }
        } else if (this.match(TT.READ) || this.match(TT.WRITE)) {
            let ioStmt: Token = this.consume(this.lookahead.token);
            let args = this.io_args();
            return newNode(ioStmt, ast.NodeKind.IOStmt, {
                ioStmt,
                args,
            });
        } else {
            this.throwError("Início de instrução inválido", this.lookahead);
            throw new Error();
        }
    }

    private struct_stmt(): any {
        return [];
    }

    private io_args(): ast.Node<ast.Variable>[] {
        const variables = [];
        this.consume(TT.LPAR);
        let variable = this.variable();
        variables.push(newNode(variable.id, ast.NodeKind.Variable, variable));
        while (this.match(TT.COMMA)) {
            this.consume(TT.COMMA);
            let variable = this.variable();
            variables.push(
                newNode(variable.id, ast.NodeKind.Variable, variable)
            );
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

    private formal_args(): ast.Node<ast.Expression>[] {
        let expressions = [];
        this.consume(TT.LPAR);
        expressions.push(this.expression());
        while (this.match(TT.COMMA)) {
            this.consume(TT.COMMA);
            expressions.push(this.expression());
        }
        this.consume(TT.RPAR);
        return expressions;
    }

    private expression(): ast.Node<ast.Expression> {
        let lhs = this.simple_expr();
        while (
            this.match(TT.GREATER) ||
            this.match(TT.GREATEREQ) ||
            this.match(TT.LESS) ||
            this.match(TT.LESSEQ) ||
            this.match(TT.AND) ||
            this.match(TT.OR)
        ) {
            let op = this.consume(this.lookahead.token);
            let rhs = this.simple_expr();
            lhs = newNode(op, ast.NodeKind.BinOp, { lhs, op, rhs });
        }

        return lhs;
    }

    private simple_expr(): ast.Node<ast.Expression> {
        let sign: Token | null = null;
        if (this.match(TT.ADDOP) || this.match(TT.SUBOP)) {
            sign = this.consume(this.lookahead.token);
        }
        let lhs =
            sign === null
                ? this.term()
                : newNode(sign, ast.NodeKind.UnaryOp, {
                      op: sign,
                      operand: this.term(),
                  });
        while (this.match(TT.ADDOP) || this.match(TT.SUBOP)) {
            let op = this.consume(this.lookahead.token);
            let rhs = this.simple_expr();
            lhs = newNode(op, ast.NodeKind.BinOp, { op, lhs, rhs });
        }
        return lhs;
    }

    private term(): ast.Node<ast.Expression> {
        let lhs = this.factor();
        while (
            this.match(TT.DIV) ||
            this.match(TT.MULOP) ||
            this.match(TT.DIVOP)
        ) {
            let op = this.consume(this.lookahead.token);
            let rhs = this.term();
            lhs = newNode(op, ast.NodeKind.BinOp, { op, lhs, rhs });
        }
        return lhs;
    }

    private factor(): ast.Node<ast.Expression> {
        switch (this.lookahead.token) {
            case TT.ID: {
                let id = this.consume(TT.ID);
                if (this.match(TT.LBRACK)) {
                    this.consume(TT.LBRACK);
                    let index = this.expression();
                    this.consume(TT.RBRACK);
                    return newNode(id, ast.NodeKind.Variable, { id, index });
                } else if (this.match(TT.LPAR)) {
                    let args = this.formal_args();
                    return newNode(id, ast.NodeKind.Call, {
                        callee: newNode(id, ast.NodeKind.Variable, { id }),
                        args,
                    });
                }
                return newNode(id, ast.NodeKind.Variable, { id });
            }
            case TT.INT:
            case TT.FLOAT:
            case TT.TRUE:
            case TT.FALSE:
            case TT.STRING: {
                let tok = this.consume(this.lookahead.token);
                return newNode(tok, ast.NodeKind.Literal, {
                    tokType: tok.token,
                    value: tok.lexeme,
                });
            }
            case TT.LPAR: {
                this.consume(TT.LPAR);
                let expr = this.expression();
                this.consume(TT.RPAR);
                return expr;
            }
            case TT.NOT: {
                let negation = {
                    op: this.consume(TT.NOT),
                    operand: this.factor(),
                };
                return newNode(negation.op, ast.NodeKind.UnaryOp, negation);
            }
            default:
                this.throwError("Início inválido de expressão", this.lookahead);
                throw new Error();
        }
    }
}
