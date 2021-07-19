/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 *
 *
 */
public class Analex {

    private BufferedReader arquivo;
    private String arquivoNome;
    private String linha;
    private int numeroLinha;
    private int posicaoLinha;

    public Analex() {
        this.arquivo = null;
        this.arquivoNome = "";
        this.linha = "";
        this.numeroLinha = 0;
        this.posicaoLinha = 0;
    }

    public Analex(String nomeArquivo) throws IOException {
        this.arquivo = new BufferedReader(new FileReader(nomeArquivo));
        this.arquivoNome = nomeArquivo;
        //this.linha = arquivo.readLine().concat("\n");
        this.linha = arquivo.readLine();
        this.numeroLinha = 1;
        this.posicaoLinha = 0;
    }

    public void abreArquivo(String nomeArquivo) throws IOException {
        this.arquivo = new BufferedReader(new FileReader(nomeArquivo));
        this.arquivoNome = nomeArquivo;
        //this.linha = arquivo.readLine().concat("\n");
        this.linha = arquivo.readLine();
        this.numeroLinha = 1;
        this.posicaoLinha = 0;
    }

    public void fechaArquivo() throws IOException {
        this.arquivo.close();
        this.linha = "";
        this.numeroLinha = 0;
        this.posicaoLinha = 0;
    }

    private char lerCaracter() {
        if (linha == null) {
            return 0;
        }

        if (posicaoLinha == linha.length()) {
            try {
                linha = arquivo.readLine();
                numeroLinha++;

                if (linha == null)//casol leu o fim do arquivo
                {
                    return 0;
                }

                if (linha.equals("")) {
                    posicaoLinha = 0;
                    return ' ';
                }
                //linha = linha.concat("\n");

                posicaoLinha = 0;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        char ch = linha.charAt(posicaoLinha);
        posicaoLinha++;
        return ch;
    }

    private char VerificalerCaracter() {
        if (linha == null) {
            return 0;
        }

        if (posicaoLinha == linha.length()) {
            return '\n';
        }
        char ch = linha.charAt(posicaoLinha);

        return ch;
    }

    private boolean verificaProximoChar(char ch) {
        char nextChar = VerificalerCaracter();

        return ch == nextChar;
    }

    private void getNewLine() {
        try {
            linha = arquivo.readLine();
            if (linha != null) {
                linha.concat("\n");
            }
            posicaoLinha = 0;
            numeroLinha++;
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public Token getToken() {
        Token token = null;
        int estado = 0;
        String lexema = "";
        char ch;
        while (token == null) {
            switch (estado) {
                case 0:
                    ch = lerCaracter();
                    switch (ch) {
                        case '.':
                            if (verificaProximoChar('.')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.PONTOPONTO, "..", numeroLinha);
                                break;
                            }
                            token = new Token(Tokens.PONTO, ".", numeroLinha);

                            break;

                        case ';':
                            token = new Token(Tokens.PONTOVIRGULA, ";", numeroLinha);

                            break;
                        case ',':
                            token = new Token(Tokens.VIRGULA, ",", numeroLinha);
                            break;
                        case '(':
                            token = new Token(Tokens.ABREPAR, "(", numeroLinha);
                            break;
                        case ')':
                            token = new Token(Tokens.FECHAPAR, ")", numeroLinha);
                            break;
                        case '[':
                            token = new Token(Tokens.ABRECOCH, "[", numeroLinha);
                            break;
                        case ']':
                            token = new Token(Tokens.FECHACOCH, "]", numeroLinha);
                            break;
                        case '}':
                            token = new Token(Tokens.FECHACHAV, "}", numeroLinha);
                            break;
                        case '{':
                            token = new Token(Tokens.ABRECHAV, "{", numeroLinha);
                            break;
                        case '"':
                            ch = lerCaracter();

                            while (ch != '"') {
                                lexema += String.valueOf(ch);
                                ch = lerCaracter();
                            }
                            token = new Token(Tokens.STRING, lexema, numeroLinha);
                            break;

                        case '\'':
                            ch = lerCaracter();

                            while (ch != '\'') {
                                lexema += String.valueOf(ch);
                                ch = lerCaracter();
                            }
                            token = new Token(Tokens.STRING, lexema, numeroLinha);
                            break;

                        case '*':
                            if (verificaProximoChar('=')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.VEZESIGUAL, "*=", numeroLinha);
                            }
                            token = new Token(Tokens.VEZES, "*", numeroLinha);
                            break;
                        case '=':
                            token = new Token(Tokens.IGUAL, "=", numeroLinha);
                            break;
                        case '>':
                            if (verificaProximoChar('=')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.MAIORIGUAL, ">=", numeroLinha);
                            }

                            token = new Token(Tokens.MAIOR, ">", numeroLinha);

                            break;
                        case '<':
                            if (verificaProximoChar('=')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.MAIORIGUAL, "<=", numeroLinha);
                            } else {
                                if (verificaProximoChar('>')) {
                                    ch = lerCaracter();
                                    token = new Token(Tokens.DIFERENTE, "<>", numeroLinha);
                                } else {

                                    token = new Token(Tokens.MENOR, "<", numeroLinha);
                                }
                            }
                            break;
                        case '+':
                            lexema += String.valueOf(ch);
                            estado = 3;
                            break;
                        case '-':
                            if (verificaProximoChar('=')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.MENOSIGUAL, "-=", numeroLinha);
                            }

                            token = new Token(Tokens.MENOS, "-", numeroLinha);

                            break;
                        case '/':
                            if (verificaProximoChar('/')) {

                                //token = new Token(Tokens.BARRABARRA,"//",numeroLinha);
                                getNewLine();
                                token = new Token(Tokens.BARRA, "/", numeroLinha);
                                numeroLinha--;
                                continue;

                            } else {

                                token = new Token(Tokens.DIVISAO, "/", numeroLinha);
                            }
                            break;
                        case '~':
                            token = new Token(Tokens.TIL, "~", numeroLinha);
                            break;
                        case ':':
                            if (verificaProximoChar('=')) {
                                ch = lerCaracter();
                                token = new Token(Tokens.ATRIB, ":=", numeroLinha);
                            } else {
                                //posicaoLinha--;
                                token = new Token(Tokens.DOISPONTOS, ":", numeroLinha);

                            }
                            break;
                        case ' ':
                            estado = 0;
                            break;
                        default:
                            if (Character.isLetter(ch) || ch == '_') {
                                lexema += String.valueOf(ch);
                                estado = 1;
                                break;
                            } else if (Character.isDigit(ch)) {
                                lexema += String.valueOf(ch);
                                estado = 40;

                            } else {
                                token = new Token(Tokens.EOF, "EOF", numeroLinha);
                            }

                            break;

                    }
                    break;

                case 1:
                    // Letra ou _ (Letra ou _ ou digito)*
                    ch = lerCaracter();
                    if (Character.isLetter(ch) || Character.isDigit(ch) || ch == '_') {
                        lexema += String.valueOf(ch);
                        estado = 1;
                    } else if (ch == ' ') {
                        estado = 2;
                    } else {

                        estado = 2;

                    }
                    break;
                case 2:
                    // Estado final 
                    //token = new Token(Tokens.ID, lexema, numeroLinha);

                    switch (lexema) {
                        case "char":
                            token = new Token(Tokens.CHAR, lexema, numeroLinha);
                            break;
                        case "real":
                            token = new Token(Tokens.REAL, lexema, numeroLinha);
                            break;
                        case "integer":
                            token = new Token(Tokens.INT, lexema, numeroLinha);
                            break;
                        case "if":
                            token = new Token(Tokens.IF, lexema, numeroLinha);
                            break;
                        case "else":
                            token = new Token(Tokens.ELSE, lexema, numeroLinha);
                            break;
                        case "while":
                            token = new Token(Tokens.WHILE, lexema, numeroLinha);
                            break;
                        case "for":
                            token = new Token(Tokens.FOR, lexema, numeroLinha);
                            break;
                        case "var":
                            token = new Token(Tokens.VAR, lexema, numeroLinha);
                            break;
                        case "then":
                            token = new Token(Tokens.THEN, lexema, numeroLinha);
                            break;
                        case "begin":
                            token = new Token(Tokens.BEGIN, lexema, numeroLinha);
                            break;
                        case "nil":
                            token = new Token(Tokens.NIL, lexema, numeroLinha);
                            break;
                        case "absolute":
                            token = new Token(Tokens.ABSOLUTE, lexema, numeroLinha);
                            break;
                        case "and":
                            token = new Token(Tokens.AND, lexema, numeroLinha);
                            break;
                        case "or":
                            token = new Token(Tokens.OR, lexema, numeroLinha);
                            break;
                        case "end":
                            token = new Token(Tokens.END, lexema, numeroLinha);
                            break;
                        case "set":
                            token = new Token(Tokens.SET, lexema, numeroLinha);
                            break;
                        case "not":
                            token = new Token(Tokens.NOT, lexema, numeroLinha);
                            break;
                        case "shl":
                            token = new Token(Tokens.SHL, lexema, numeroLinha);
                            break;
                        case "array":
                            token = new Token(Tokens.ARRAY, lexema, numeroLinha);
                            break;
                        case "object":
                            token = new Token(Tokens.OBJECT, lexema, numeroLinha);
                            break;
                        case "shr":
                            token = new Token(Tokens.SHR, lexema, numeroLinha);
                            break;
                        case "asm":
                            token = new Token(Tokens.ASM, lexema, numeroLinha);
                            break;
                        case "of":
                            token = new Token(Tokens.OF, lexema, numeroLinha);
                            break;
                        case "string":
                            token = new Token(Tokens.STRING, lexema, numeroLinha);
                            break;
                        case "double":
                            token = new Token(Tokens.DOUBLE, lexema, numeroLinha);
                            break;
                        case "boolean":
                            token = new Token(Tokens.BOOL, lexema, numeroLinha);
                            break;
                        case "const":
                            token = new Token(Tokens.CONST, lexema, numeroLinha);
                            break;
                        case "on":
                            token = new Token(Tokens.ON, lexema, numeroLinha);
                            break;

                        case "break":
                            token = new Token(Tokens.CONST, lexema, numeroLinha);
                            break;
                        case "goto":
                            token = new Token(Tokens.GOTO, lexema, numeroLinha);
                            break;
                        case "operator":
                            token = new Token(Tokens.OPERATOR, lexema, numeroLinha);
                            break;
                        case "to":
                            token = new Token(Tokens.TO, lexema, numeroLinha);
                            break;
                        case "case":
                            token = new Token(Tokens.CASE, lexema, numeroLinha);
                            break;
                        case "type":
                            token = new Token(Tokens.TYPE, lexema, numeroLinha);
                            break;
                        case "implementation":
                            token = new Token(Tokens.IMPLEMENTATION, lexema, numeroLinha);
                            break;
                        case "otherwise":
                            token = new Token(Tokens.OTHERWISE, lexema, numeroLinha);
                            break;
                        case "packed":
                            token = new Token(Tokens.PACKED, lexema, numeroLinha);
                            break;
                        case "unit":
                            token = new Token(Tokens.UNIT, lexema, numeroLinha);
                            break;
                        case "constructor":
                            token = new Token(Tokens.CONSTRUCTOR, lexema, numeroLinha);
                            break;
                        case "in":
                            token = new Token(Tokens.IN, lexema, numeroLinha);
                            break;
                        case "procedure":
                            token = new Token(Tokens.PROCEDURE, lexema, numeroLinha);
                            break;
                        case "inherited":
                            token = new Token(Tokens.INHERITED, lexema, numeroLinha);
                            break;
                        case "program":
                            token = new Token(Tokens.PROGRAM, lexema, numeroLinha);
                            break;
                        case "uses":
                            token = new Token(Tokens.USES, lexema, numeroLinha);
                            break;
                        case "destructor":
                            token = new Token(Tokens.DESTRUCTOR, lexema, numeroLinha);
                            break;
                        case "inline":
                            token = new Token(Tokens.INLINE, lexema, numeroLinha);
                            break;
                        case "record":
                            token = new Token(Tokens.RECORD, lexema, numeroLinha);
                            break;
                        case "div":
                            token = new Token(Tokens.DIV, lexema, numeroLinha);
                            break;
                        case "interface":
                            token = new Token(Tokens.INTERFACE, lexema, numeroLinha);
                            break;
                        case "function":
                            token = new Token(Tokens.FUNCTION, lexema, numeroLinha);
                            break;
                        case "reintroduce":
                            token = new Token(Tokens.REINTRODUCE, lexema, numeroLinha);
                            break;
                        case "do":
                            token = new Token(Tokens.DO, lexema, numeroLinha);
                            break;
                        case "label":
                            token = new Token(Tokens.LABEL, lexema, numeroLinha);
                            break;
                        case "repeat":
                            token = new Token(Tokens.REPEAT, lexema, numeroLinha);
                            break;
                        case "with":
                            token = new Token(Tokens.WITH, lexema, numeroLinha);
                            break;
                        case "downto":
                            token = new Token(Tokens.DOWNTO, lexema, numeroLinha);
                            break;
                        case "mod":
                            token = new Token(Tokens.MOD, lexema, numeroLinha);
                            break;
                        case "self":
                            token = new Token(Tokens.SELF, lexema, numeroLinha);
                            break;
                        case "xor":
                            token = new Token(Tokens.XOR, lexema, numeroLinha);
                            break;
                        case "as":
                            token = new Token(Tokens.AS, lexema, numeroLinha);
                            break;
                        case "class":
                            token = new Token(Tokens.CLASS, lexema, numeroLinha);
                            break;
                        case "except":
                            token = new Token(Tokens.EXCEPT, lexema, numeroLinha);
                            break;
                        case "exports":
                            token = new Token(Tokens.EXPORTS, lexema, numeroLinha);
                            break;
                        case "finalization":
                            token = new Token(Tokens.FINALIZATION, lexema, numeroLinha);
                            break;
                        case "finally":
                            token = new Token(Tokens.FINALLY, lexema, numeroLinha);
                            break;
                        case "initialization":
                            token = new Token(Tokens.INITIALIZATION, lexema, numeroLinha);
                            break;
                        case "is":
                            token = new Token(Tokens.IS, lexema, numeroLinha);
                            break;
                        case "library":
                            token = new Token(Tokens.LIBRARY, lexema, numeroLinha);
                            break;
                        case "out":
                            token = new Token(Tokens.OUT, lexema, numeroLinha);
                            break;
                        case "raise":
                            token = new Token(Tokens.RAISE, lexema, numeroLinha);
                            break;
                        case "threadvar":
                            token = new Token(Tokens.THREADVAR, lexema, numeroLinha);
                            break;
                        case "try":
                            token = new Token(Tokens.TRY, lexema, numeroLinha);
                            break;
                        case "dispose":
                            token = new Token(Tokens.DISPOSE, lexema, numeroLinha);
                            break;
                        case "false":
                            token = new Token(Tokens.FALSE, lexema, numeroLinha);
                            break;
                        case "true":
                            token = new Token(Tokens.TRUE, lexema, numeroLinha);
                            break;
                        case "exit":
                            token = new Token(Tokens.EXIT, lexema, numeroLinha);
                            break;
                        case "new":
                            token = new Token(Tokens.NEW, lexema, numeroLinha);
                            break;
                        case "writeln":
                            token = new Token(Tokens.WRITELN, lexema, numeroLinha);
                            break;
                        case "readln":
                            token = new Token(Tokens.READLN, lexema, numeroLinha);
                            break;
                        default:
                            token = new Token(Tokens.ID, lexema, numeroLinha);

                            break;

                    }

                    posicaoLinha--;

                    // ch=lerCaracter();
                    break;
                case 3:
                    // +
                    ch = lerCaracter();
                    if (ch == '=') {
                        lexema += String.valueOf(ch);
                        estado = 38;
                    } else {
                        estado = 4;
                    }
                    break;
                case 4:
                    //estdo final ate aqui temos o +
                    token = new Token(Tokens.MAIS, lexema, numeroLinha);
                    posicaoLinha--;
                    break;
                case 38:
                    // +=
                    token = new Token(Tokens.MAISIGUAL, lexema, numeroLinha);
                    break;
                case 40:
                    ch = lerCaracter();
                    if (Character.isDigit(ch)) {
                        lexema += String.valueOf(ch);
                        estado = 40;
                    } else if (ch == '.') {
                        if (verificaProximoChar('.')) {
                            estado = 0;
                            posicaoLinha--;
                            token = new Token(Tokens.NUMINT, lexema, numeroLinha);
                            break;
                        } else {
                            lexema += String.valueOf(ch);
                            estado = 42;
                        }
                    } else {
                        posicaoLinha--;
                        token = new Token(Tokens.NUMINT, lexema, numeroLinha);

                    }
                    break;
                case 42:
                    ch = lerCaracter();
                    if (Character.isDigit(ch)) {
                        lexema += String.valueOf(ch);
                        estado = 43;
                    } else if (verificaProximoChar(ch)) {
                        if (Character.isDigit(ch)) {
                            estado = 43;
                        }
                    } else {
                        token = new Token(Tokens.NUMREAL, lexema, numeroLinha);
                    }

                    break;
                case 43:
                    ch = lerCaracter();

                    lexema += String.valueOf(ch);
                    estado = 43;
                    token = new Token(Tokens.NUMREAL, lexema, numeroLinha);
                    break;
                default:
                    System.out.println("Default");
            }

        }
        return token;
    }
}
