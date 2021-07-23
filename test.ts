import { isDigit, isLetter, Lexer } from "./src/lex";
import { TT } from "./src/token";
import { equal } from "assert";

const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
];
const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const delimeters = ["<", ">", ".", "!", "=", ":", ";", "/", "=", "+", "-"];

function testIsLetter() {
    equal(
        letters.every((value) => isLetter(value)),
        true
    );

    equal(
        letters
            .map((value) => value.toUpperCase())
            .every((value) => isLetter(value)),
        true
    );

    equal(
        digits.every((value) => isLetter(value)),
        false
    );

    equal(
        delimeters.every((value) => isLetter(value)),
        false
    );
}

function testIsDigit() {
    equal(
        digits.every((value) => isDigit(value)),
        true
    );

    equal(
        letters.every((value) => isDigit(value)),
        false,
        "Is digit failed"
    );

    equal(
        delimeters.every((value) => isDigit(value)),
        false
    );
}

function testLexer() {
    const source = `
"emanuel trissandro"
'emanuel trissandro'
2000
250 
231.12123
23.
integer  boolean char real  true  false
+ 
- 
* 
/
=  
<> 
<  
> 
<=  
>=
( 
) 
[ 
]  
:= 
. 
, 
;
: 
.. 
div 
or and  not if then else of  while  do 
begin  end  read  write  var  array 
procedure  function program
`;

    const lexer = new Lexer(source);
    equal(lexer.nextToken().token, TT.STRING);
    equal(lexer.nextToken().token, TT.STRING);
    equal(lexer.nextToken().token, TT.INT);
    equal(lexer.nextToken().token, TT.INT);
    equal(lexer.nextToken().token, TT.FLOAT);
    equal(lexer.nextToken().token, TT.INT);
    equal(lexer.nextToken().token, TT.DOT);
    equal(lexer.nextToken().token, TT.INTEGER);
    equal(lexer.nextToken().token, TT.BOOLEAN);
    equal(lexer.nextToken().token, TT.CHAR);
    equal(lexer.nextToken().token, TT.REAL);
    equal(lexer.nextToken().token, TT.TRUE);
    equal(lexer.nextToken().token, TT.FALSE);
    equal(lexer.nextToken().token, TT.ADDOP);
    equal(lexer.nextToken().token, TT.SUBOP);
    equal(lexer.nextToken().token, TT.MULOP);
    equal(lexer.nextToken().token, TT.DIVOP);
    equal(lexer.nextToken().token, TT.EQ);
    equal(lexer.nextToken().token, TT.NOTEQ);
    equal(lexer.nextToken().token, TT.LESS);
    equal(lexer.nextToken().token, TT.GREATER);
    equal(lexer.nextToken().token, TT.LESSEQ);
    equal(lexer.nextToken().token, TT.GREATEREQ);
    equal(lexer.nextToken().token, TT.LPAR);
    equal(lexer.nextToken().token, TT.RPAR);
    equal(lexer.nextToken().token, TT.LBRACK);
    equal(lexer.nextToken().token, TT.RBRACK);
    equal(lexer.nextToken().token, TT.ASSIGN);
    equal(lexer.nextToken().token, TT.DOT);
    equal(lexer.nextToken().token, TT.COMMA);
    equal(lexer.nextToken().token, TT.SEMICOL);
    equal(lexer.nextToken().token, TT.COLON);
    equal(lexer.nextToken().token, TT.DOTDOT);
    equal(lexer.nextToken().token, TT.DIV);
    equal(lexer.nextToken().token, TT.OR);
    equal(lexer.nextToken().token, TT.AND);
    equal(lexer.nextToken().token, TT.NOT);
    equal(lexer.nextToken().token, TT.IF);
    equal(lexer.nextToken().token, TT.THEN);
    equal(lexer.nextToken().token, TT.ELSE);
    equal(lexer.nextToken().token, TT.OF);
    equal(lexer.nextToken().token, TT.WHILE);
    equal(lexer.nextToken().token, TT.DO);
    equal(lexer.nextToken().token, TT.BEGIN);
    equal(lexer.nextToken().token, TT.END);
    equal(lexer.nextToken().token, TT.READ);
    equal(lexer.nextToken().token, TT.WRITE);
    equal(lexer.nextToken().token, TT.VAR);
    equal(lexer.nextToken().token, TT.ARRAY);
    equal(lexer.nextToken().token, TT.PROCEDURE);
    equal(lexer.nextToken().token, TT.FUNCTION);
    equal(lexer.nextToken().token, TT.PROGRAM);
}

function main() {
    console.log("Testing isDigit...");
    testIsDigit();
    console.log("isDigit has passed!\n\n");
    console.log("Testing isLetter...");
    testIsLetter();
    console.log("isLetter has passed!\n\n");
    console.log("Testing Lexer...");
    testLexer();
    console.log("Lexer has passed!\n\n");
    console.log("All tests passed!");
}

main();
