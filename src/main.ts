import { Parser } from "./parse";
import { inspect } from "./ast";
import { readFileSync } from "fs";
import { exit } from "process";
import { Node, Program } from "./ast";
import * as process from "process";

const main = () => {
    const filename = process.argv[2];
    const src = readFileSync(filename).toString("utf-8");
    const parser = new Parser(src);
    let [program, errors] = parser.parse();
    let numErrs = errors.length;
    //Reportar erros sintáticos
    if (numErrs > 0) {
        console.error(`Foram encontrado(s) ${numErrs} erros sintáticos: \n`);
        errors.forEach((err) => console.error(err.message));
        exit(1);
    }
    //
    inspect(program as Node<Program>);
};

main();
