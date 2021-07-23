import { Parser } from "./parse";
import { inspect } from "./ast";
import { readFileSync } from "fs";
import { exit } from "process";
import * as process from "process";

const main = () => {
    const filename = process.argv[2];
    const src = readFileSync(filename).toString("utf-8");
    const parser = new Parser(src);
    let [program, errors] = parser.parse();
    let numErrs = errors.length;
    //Reportar erros sintáticos
    if (numErrs > 0) {
        console.error(`Foram encontrado(s) ${numErrs}: \n\n\n`);
        errors.forEach((err) => console.log(err.message));
        exit(1);
    }
    //
    inspect(program);
};

main();
