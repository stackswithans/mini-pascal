import { Parser } from "./parse";
import { verifyProgram } from "./check";
import { readFileSync } from "fs";
import { exit } from "process";
import { Node, Program } from "./ast";
import * as process from "process";

const showErrors = (hasErrors: boolean, errors: any[]) => {
    if (hasErrors) {
        console.error(`Foram encontrado(s) ${errors.length} erros: \n`);
        errors.forEach((err) => console.error(err.message));
        exit(1);
    }
};

const main = () => {
    const filename = process.argv[2];
    const src = readFileSync(filename).toString("utf-8");
    const parser = new Parser(src);
    let [program, errors] = parser.parse();
    //Reportar erros sintáticos
    showErrors(program === null, errors);
    let [hasErrors, errs] = verifyProgram(program as Node<Program>);
    //Reportar Errors semânticos
    showErrors(hasErrors, errs);
};

main();
