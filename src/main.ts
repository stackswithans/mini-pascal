import { Parser } from "./parse";
import { inspect } from "./ast";
import { readFileSync } from "fs";
import * as process from "process";

const main = () => {
    const filename = process.argv[2];
    const src = readFileSync(filename).toString("utf-8");
    const parser = new Parser(src);
    let program = parser.parse();
    inspect(program);
};

main();
