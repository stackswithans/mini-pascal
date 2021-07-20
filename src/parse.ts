import { Lexer } from "./lex";
import { Token, TT } from "./token";
import { Program, Block, Type, ArrayType, ArrayRange, VarDecl } from "./nodes";

type ParseError = { message: string; line: number; col: number };

export class Parser {
    private lookahead: Token;
    private lexer: Lexer;
    private errors: ParseError[] = [];

    constructor(source: string) {
        this.lexer = new Lexer(source);
        this.lookahead = this.lexer.nextToken();
    }

    private consume(tokenT: TT): Token {
        if (!(this.lookahead.token === tokenT)) {
            throw new Error(
                `Expected ${tokenT} but got ${this.lookahead.token}`
            );
        }
        let old = this.lookahead;
        this.lookahead = this.lexer.nextToken();
        return old;
    }

    private match(tokenT: TT): boolean {
        return this.lookahead.token === tokenT;
    }

    public parse(): Program {
        return this.program();
    }

    private program(): Program {
        this.consume(TT.PROGRAM);
        let id = this.consume(TT.ID);
        this.consume(TT.SEMICOL);
        let block = this.block();
        this.consume(TT.DOT);
        return new Program(id, block);
    }

    private block(): Block {
        let block = new Block();
        if (this.match(TT.VAR)) {
            block.pushInstructions(this.var_decl_sect());
        }
        /*
        if (this.match(TT.PROCEDURE) || this.match(TT.PROGRAM)) {
            block.pushInstructions(this.sub_decl_sect());
        }
        if (this.match(TT.BEGIN)) {
            block.pushInstructions(this.compound_stmt());
        }*/
        return block;
    }

    private var_decl_sect(): VarDecl[] {
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

    private var_decl(): VarDecl {
        let id = this.consume(TT.ID);
        this.consume(TT.COLON);
        let sem_type = this.sem_type();
        return new VarDecl(id, sem_type);
    }

    private sem_type(): ArrayType | Type {
        if (
            this.match(TT.CHAR) ||
            this.match(TT.INTEGER) ||
            this.match(TT.REAL)
        ) {
            return new Type(this.simple_type());
        }
        let tok = this.consume(TT.ARRAY);
        this.consume(TT.LBRACK);
        let range = this.index_range();
        this.consume(TT.RBRACK);
        this.consume(TT.OF);
        let s_type = new Type(this.simple_type());
        return new ArrayType(tok, range, s_type);
    }

    private index_range(): ArrayRange {
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
                throw new Error("Tipo de dados inválido");
        }
    }
    /*
    private sub_decl_sect(): SubRoutine[] {
        let subroutines: SubRoutine[] = [];
        while (this.match(TT.PROCEDURE) || this.match(TT.FUNCTION)) {
            if (this.match(TT.PROCEDURE)) {
                subroutines.push(this.proc_decl());
            } else {
                subroutines.push(this.func_decl());
            }
        }
        return subroutines;
    }

    private proc_decl(): SubRoutine {
        let id: Token;
        let formal_params: Params;
        let block: Block;
        let return_type: Type;
        this.consume(TT.PROCEDURE);
        id = this.consume(TT.ID);
        formal_params = this.formal_params();
        this.consume(TT.SEMICOL);
        block = this.block();
        this.consume(TT.SEMICOL);
        return new SubRoutine(id, formal_params, block, null);
    }

    private func_decl(): SubRoutine {
        let id: Token;
        let formal_params: Params;
        let block: Block;
        let return_type: Type;
        this.consume(TT.FUNCTION);
        id = this.consume(TT.ID);
        formal_params = this.formal_params();
        this.consume(TT.COLON);
        return_type = this.sem_type();
        this.consume(TT.SEMICOL);
        block = this.block();
        this.consume(TT.SEMICOL);
        return new SubRoutine(id, formal_params, block, return_type);
    }

    private formal_params(): Params {
        let params: VarDecl[] = [];
        this.consume(TT.LPAR);
        if (this.match(TT.ID)) {
            params.decls.push(this.var_decl());
            while (this.match(TT.SEMICOL)) {
                this.consume(TT.SEMICOL);
                params.push(this.var_decl());
            }
        }
        this.consume(TT.RPAR);
        return new Params(params);
    }

    private compound_stmt(): Statement[] {
        const statements: Statement[] = [];
        this.consume(TT.BEGIN);
        statements.append(this.statement());
        while (this.match(TT.SEMICOL)) {
            this.consume(TT.SEMICOL);
            statements.append(this.statement);
        }
        this.consume(TT.END);
        return statements;
    }

    private statement(): Statement {
        if (this.match(TT.ID) || this.match(TT.READ) || this.match(TT.WRITE)) {
            return this.simple_stmt();
        } else {
            return this.struct_stmt();
        }
    }

    private simple_stmt(): Statement {
        if (this.match(TT.ID)) {
            const variable = this.variable();
            if (this.match(TT.ASSIGN)) {
                this.consume(TT.ASSIGN);
                return new Assign(variable, this.expression());
            }
        }
    }
    */
}
