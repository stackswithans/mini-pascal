import { Lexer } from "./lex";
import { TT } from "./token";
import { readFileSync } from "fs";
import * as process from "process";

const main = () => {
    const filename = process.argv[2];
    const src = readFileSync(filename).toString("utf-8");
    const lexer = new Lexer(src);
    let token = lexer.nextToken();
    while (token.token !== TT.EOF) {
        console.log(`Type: ${token.token}`);
        console.log(`Lexema: ${token.lexeme}`);
        console.log(`Linha: ${token.line}`);
        console.log(`Coluna: ${token.col}`);
        console.log("----------------------------\n\n");
        token = lexer.nextToken();
    }
};

main();
