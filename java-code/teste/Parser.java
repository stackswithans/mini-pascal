/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

/**
 *
 * @author RLDebugger
 */
import java.io.IOException;
import java.util.ArrayList;
import javax.tools.OptionChecker;

class Parser {

    private Token lookahead;
    private Analex lexer;

    private static final int EXPECTED_ERROR = 1; //Erro quando só tem uma alternativa
    private static final int UNKNOWN_ERROR = 2; // Erro para várias alternativas
    Semantico variavelver = new Semantico();
    ArrayList<String> arrayVar = new ArrayList<>();
    public static ArrayList<String> arrayInteger = new ArrayList();
    public static ArrayList<String> arrayChar = new ArrayList();
    public static ArrayList<String> arrayReal = new ArrayList();

    public Parser(String arquivo) throws IOException {
        variavelver.tipo = new ArrayList<>();
        variavelver.variavel = new ArrayList<>();
        lexer = new Analex();
        lexer.abreArquivo(arquivo);
    }
    public static ArrayList<String> listaerro = new ArrayList();

    //Error Handling method
    private void errorvariavel(String lexema) {
        listaerro.add("EERRO SEMANTICO :  variavel " + lexema + " ja foi declarada");
    }

    private void imcompativeis(int lexema) {
        listaerro.add("EERRO SEMANTICO :  INCOMPATIBILIDADE NOS TIPOS DE DADOS NA LINHA " + lexema);
    }

    private void naodeclarada(String lexema) {
        listaerro.add("ERRO SEMANTICO : VARIAVEL NAO DECLARADA " + lexema);
    }

    private void error(Tokens expected, int type) {
        switch (type) {
            case 1:

                listaerro.add("Erro na linha " + lookahead.getLinha() + "\n" + "Era esperado o token " + expected + " porém foi recebido " + lookahead.getToken() + ".");

                break;
            case 2:
                System.err.println(String.format("Símbolo inesperado:%s. Linha:%d", lookahead.getLexema(), lookahead.getLinha()));
                break;
        }
    }

    private void gotoStatement() {
        if (lookahead.getToken().equals(Tokens.GOTO)) {
            consume();
            label();
        } else {
            error(Tokens.GOTO, EXPECTED_ERROR);
        }
    }

    //Function that advances the input
    private void consume() {
        //Get next input symbol
        lookahead = lexer.getToken();
        currenttokens = lookahead.getToken();
    }

    public void parser() {
        lookahead = lexer.getToken();
        program();

        if (lookahead.getToken().equals(Tokens.EOF)) {
            System.out.println("Compilação realizada com sucesso.");
        }
    }

    public void program() {

        if (lookahead.getToken() == Tokens.PROGRAM) {
            consume();
            identifier();
            if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                consume();
                block();

                if (lookahead.getToken() == Tokens.PONTO) {
                    consume();
                } else {
                    error(Tokens.PONTO, 1);
                }
            } else {

                error(Tokens.PONTOVIRGULA, 1);

            }
        } else {
            error(Tokens.PROGRAM, 1);
        }

    }

    private void unsignedNumber() {
        switch (lookahead.getToken()) {
            case NUMINT:
                consume();
                break;
            case NUMREAL:
                consume();
                break;
            default:
                error(Tokens.NUMREAL, UNKNOWN_ERROR);
                break;
        }
    }

    private void empty() {
        consume();
    }

    private void labelDeclarationpart() {
        if (lookahead.getToken().equals(Tokens.LABEL)) {
            consume();
            label();
            while (lookahead.getToken().equals(Tokens.VIRGULA)) {
                consume();
                label();
            }
            if (lookahead.getToken().equals(Tokens.PONTOVIRGULA)) {
                consume();
            } else {
                error(Tokens.PONTOVIRGULA, EXPECTED_ERROR);
            }

        } else {
            empty();
        }
    }

    private void constantdefpart() {
        if (lookahead.getToken().equals(Tokens.CONST)) {
            consume();
            constantdef();
            while (lookahead.getToken().equals(Tokens.PONTOVIRGULA)) {
                consume();
                if (lookahead.getToken().equals(Tokens.ID)) {
                    constantdef();
                    if (lookahead.getToken().equals(Tokens.PONTOVIRGULA)) {
                        break;
                    }
                } else {
                    break;
                }
            }
        } else {
            error(Tokens.CONST, EXPECTED_ERROR);
        }
    }

    private void constantdef() {
        if (lookahead.getToken().equals(Tokens.ID)) {
            consume();
            if (lookahead.getToken().equals(Tokens.IGUAL)) {
                consume();
                constant();
            } else {
                error(Tokens.IGUAL, EXPECTED_ERROR);
            }
        } else {
            error(Tokens.ID, EXPECTED_ERROR);
        }
    }

    private void constant() {
        if (lookahead.getToken().equals(Tokens.STRING)) {
            consume();
        } else if ((lookahead.getToken().equals(Tokens.MAIS)) || (lookahead.getToken().equals(Tokens.MAIS))) {
            sign();
            sign1();
        } else {
            sign1();
        }
    }

    private void sign1() {
        if (!(lookahead.getToken().equals(Tokens.MAIS)) || !(lookahead.getToken().equals(Tokens.MAIS))) {
            unsignedNumber();
        } else {
            identifier();
        }
    }

    private void emptystatement() {
        empty();
    }

    private void label() {
        if (lookahead.getToken().equals(Tokens.NUMINT)) {
            consume();
        } else {
            error(Tokens.NUMINT, EXPECTED_ERROR);
        }
    }

    private void identifier() {

        if (lookahead.getToken().equals(Tokens.ID)) {
            consume();
        } else {
            error(Tokens.ID, EXPECTED_ERROR);
        }
    }

    private void controlVariable() {
        if (lookahead.getToken().equals(Tokens.ID)) {
            consume();
        } else {
            error(Tokens.ID, EXPECTED_ERROR);
        }
    }

    private void addingOperator() {
        switch (lookahead.getToken()) {
            case MAIS:
                consume();
                break;
            case MENOS:
                consume();
                break;
            case OR:
                consume();
                break;
            default:
                error(Tokens.MAIS, UNKNOWN_ERROR);
                break;
        }
    }

    private void relationalOperator() {
        switch (lookahead.getToken()) {
            case IGUAL:
                consume();
                break;
            case DIFERENTE:
                consume();
                break;
            case MENOR:
                consume();
                break;
            case MENORIGUAL:
                consume();
                break;
            case MAIORIGUAL:
                consume();
                break;
            case MAIOR:
                consume();
                break;
            case IN:
                consume();
                break;
            default:
                error(Tokens.MAIS, UNKNOWN_ERROR);
                break;
        }
    }

    private void multiplyingOperator() {
        switch (lookahead.getToken()) {
            case VEZES:
                consume();
                break;
            case DIVISAO:
                consume();
                break;
            case DIV:
                consume();
                break;
            case MOD:
                consume();
                break;
            case AND:
                consume();
                break;

            default:
                error(Tokens.VEZES, UNKNOWN_ERROR);
                break;
        }
    }

    private void subRangeType() {
        constant();
        if (lookahead.getToken().equals(Tokens.PONTOPONTO)) {
            consume();
        } else {
            error(Tokens.PONTOPONTO, EXPECTED_ERROR);
        }
        constant();

    }

    private void typeIdentifier() {
        switch (lookahead.getToken()) {
            case ID:
                consume();
                break;
            case CHAR:
                consume();
                break;
            case INT:
                consume();
                break;
            case BOOL:
                consume();
                break;
            case DOUBLE:
                consume();
                break;
            case REAL:
                consume();
                break;
            default:
                error(Tokens.ID, UNKNOWN_ERROR);
                break;
        }
    }

    private void pointerType() {
        typeIdentifier();
    }

    private void simpleType() {

        currenttokens = lookahead.getToken();
        if (currenttokens.equals(Tokens.ABREPAR)) {
            scalarType();
        } else if ((currenttokens.equals(Tokens.ID))
                || (currenttokens.equals(Tokens.REAL))
                || (currenttokens.equals(Tokens.CHAR))
                || (currenttokens.equals(Tokens.DOUBLE))
                || (currenttokens.equals(Tokens.INT))
                || (currenttokens.equals(Tokens.BOOL))) {
            typeIdentifier();
        } else {
            subRangeType();
        }
    }

    private void scalarType() {
        if (lookahead.getToken().equals(Tokens.ABREPAR)) {
            consume();
            if (lookahead.getToken().equals(Tokens.ID)) {
                consume();
                while (lookahead.getToken().equals(Tokens.VIRGULA)) {
                    consume();
                    if (lookahead.getToken().equals(Tokens.ID)) {
                        consume();
                    } else {
                        error(Tokens.ID, EXPECTED_ERROR);
                    }
                }
                if (lookahead.getToken().equals(Tokens.FECHAPAR)) {
                    consume();
                } else {
                    error(Tokens.FECHAPAR, EXPECTED_ERROR);
                }
            } else {
                error(Tokens.ID, EXPECTED_ERROR);
            }
        }

    }

    private void entireVariable() {

        identifier();

    }

    private void resultType() {
        identifier();
    }

    private void sign() {
        switch (lookahead.getToken()) {
            case MAIS:
                consume();
                break;
            case MENOS:
                consume();
                break;
            default:
                error(Tokens.MAIS, UNKNOWN_ERROR);
                break;
        }
    }

    private void block() {
        variabledeclarationpart();
        procedureandfunctiondeclarationpaart();
        statementpart();
    }

    private void variabledeclarationpart() {

        if (lookahead.getToken() == Tokens.VAR) {

            consume();

            do {
                variabledeclaration();
                if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();

                } else {
                    error(Tokens.PONTOVIRGULA, 1);
                }

            } while (lookahead.getToken() == Tokens.ID);

            for (int i = 0; i < variavelver.variavel.size(); i++) {
                if (variavelver.variavel.get(i).equals("integer")) {

                    int j = i - 1;

                    while (!variavelver.variavel.get(j).equals("integer") && !variavelver.variavel.get(j).equals("real")
                            && !variavelver.variavel.get(j).equals("char")) {

                        arrayInteger.add(variavelver.variavel.get(j));

                        j--;
                        if (j < 0) {
                            break;
                        }

                    }

                }
                if (variavelver.variavel.get(i).equals("real")) {
                    int j = i - 1;
                    while ((!variavelver.variavel.get(j).equals("integer") && !variavelver.variavel.get(j).equals("real")
                            && !variavelver.variavel.get(j).equals("char"))) {
                        arrayReal.add(variavelver.variavel.get(j));

                        j--;
                        if (j < 0) {
                            break;
                        }
                    }
                }
                if (variavelver.variavel.get(i).equals("char")) {
                    int j = i - 1;
                    while (!variavelver.variavel.get(j).equals("integer") && !variavelver.variavel.get(j).equals("real")
                            && !variavelver.variavel.get(j).equals("char")) {
                        arrayChar.add(variavelver.variavel.get(j));
                        j--;
                        if (j < 0) {
                            break;
                        }
                    }
                }

            }

        }
    }

    private void variabledeclaration() {
        if (lookahead.getToken() == Tokens.ID) {
            // SEMANTICO
            if (variavelver.variavel.contains(lookahead.getLexema())) {
                errorvariavel(lookahead.getLexema());
            } else {
                variavelver.variavel.add(lookahead.getLexema());
                // arrayVar.add(lookahead.getLexema());
            }
            identifier();

            while (lookahead.getToken() == Tokens.VIRGULA) {
                consume();

                if (lookahead.getToken() == Tokens.ID) {
                    if (variavelver.variavel.contains(lookahead.getLexema())) {
                        errorvariavel(lookahead.getLexema());
                    } else {
                        variavelver.variavel.add(lookahead.getLexema());
                    }
                    identifier();

                } else {
                    error(Tokens.ID, 1);
                }

            }
            if (lookahead.getToken() == Tokens.DOISPONTOS) {
                consume();
                type1();

                //if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                //  consume();
                // } else {
                //   error(Tokens.PONTOVIRGULA,1);
                //}
            } else {
                error(Tokens.DOISPONTOS, 1);
            }

        }

    }

    private void type1() {
        currenttokens = lookahead.getToken();

        if (currenttokens == Tokens.ARRAY) {
            variavelver.variavel.add(currenttokens.toString());
            arraytype();

        } else if ((currenttokens.equals(Tokens.ID))
                || (currenttokens.equals(Tokens.REAL))
                || (currenttokens.equals(Tokens.CHAR))
                || (currenttokens.equals(Tokens.DOUBLE))
                || (currenttokens.equals(Tokens.INT))
                || (currenttokens.equals(Tokens.BOOL))) {
            variavelver.variavel.add(currenttokens.toString());
            simpleType();
        } else {
            error(Tokens.TIPODADO, 1);

        }

    }

    private void arraytype() {
        consume();
        if (lookahead.getToken() == Tokens.ABRECOCH) {
            consume();
            do {
                indexrange();
            } while (lookahead.getToken() == Tokens.VIRGULA);

            if (lookahead.getToken() == Tokens.FECHACOCH) {
                consume();
                if (lookahead.getToken() == Tokens.OF) {
                    consume();
                    simpleType();
                } else {
                    error(Tokens.OF, 1);
                }
            } else {
                error(Tokens.FECHACOCH, 1);
            }
        } else {
            error(Tokens.ABRECOCH, 1);
        }
    }

    private void indexrange() {
        if (lookahead.getToken() == Tokens.NUMINT) {
            consume();
            if (lookahead.getToken() == Tokens.PONTOPONTO) {
                consume();
                if (lookahead.getToken() == Tokens.NUMINT) {
                    consume();
                } else {
                    error(Tokens.NUMINT, 1);
                }
            } else {
                error(Tokens.PONTOPONTO, 1);
            }
        } else {
            error(Tokens.NUMINT, 1);
        }
    }

    private void proceduredeclarationpart() {
        while (lookahead.getToken() == Tokens.PROCEDURE) {
            proceduredeclaration();
            if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                consume();
            } else {
                error(Tokens.VIRGULA, 1);
            }
        }
    }

    private void proceduredeclaration() {

        consume();

        identifier();
        if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
            consume();
            block();
        } else {
            error(Tokens.PONTOVIRGULA, 1);
        }
    }

    private void statementpart() {
        compoundstatement();
    }
    public static Tokens retaguarda;

    private void compoundstatement() {
        Tokens aux;
        if (lookahead.getToken() == Tokens.BEGIN) {
            consume();
            statement();
            aux = lookahead.getToken();
            while (aux == Tokens.PONTOVIRGULA) {

                consume();
                statement();
                aux = lookahead.getToken();

            }
            if (aux == Tokens.END) {
                consume();
                if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();
                }
            } else {
                error(Tokens.END, 1);
            }

        } else {
            error(Tokens.BEGIN, 1);
        }
    }
    public static Tokens currenttokens;

    private void statement() {

        currenttokens = lookahead.getToken();
        if (currenttokens == Tokens.ID
                || currenttokens == Tokens.READLN
                || currenttokens == Tokens.WRITELN) {

            simplestatement();
        } else if (currenttokens == Tokens.IF
                || currenttokens == Tokens.CASE
                || currenttokens == Tokens.WHILE
                || currenttokens == Tokens.FOR) {
            structuredstatement();
        }
    }

    private void simplestatement() {

        if (currenttokens == Tokens.ID) {

            expr_statement();

        } else if (currenttokens == Tokens.READLN) {

            readstatement();
        } else if (currenttokens == Tokens.WRITELN) {
            writestatement();
        }
    }

    private void structuredstatement() {
        if (lookahead.getToken() == Tokens.IF
                || lookahead.getToken() == Tokens.CASE) {
            conditionalstatement();

        } else if (currenttokens == Tokens.WHILE
                || lookahead.getToken() == Tokens.FOR
                || lookahead.getToken() == Tokens.REPEAT) {
            repeatitivestatement();
        }
    }

    private void readstatement() {

        consume();
        if (lookahead.getToken() == Tokens.ABREPAR) {
            consume();
            variable();
            while (lookahead.getToken() == Tokens.VIRGULA) {
                consume();
                variable();
            }
            if (lookahead.getToken() == Tokens.FECHAPAR) {

                consume();
            } else {
                error(Tokens.FECHAPAR, 1);
            }
        } else {
            error(Tokens.ABREPAR, 1);
        }

    }

    private void writestatement() {

        consume();
        if (lookahead.getToken() == Tokens.ABREPAR) {

            consume();

            outvalue();
            while (lookahead.getToken() == Tokens.VIRGULA) {
                consume();
                outvalue();
            }
            if (lookahead.getToken() == Tokens.FECHAPAR) {
                consume();
                if (lookahead.getToken() != Tokens.PONTOVIRGULA) {
                    error(Tokens.PONTOVIRGULA, 1);
                }

            } else {
                error(Tokens.FECHAPAR, 1);
            }

        } else {
            error(Tokens.ABREPAR, 1);
        }

    }

    private void outvalue() {
        expression();
    }

    private void expression() {

        equality();

    }

    private void simpleexpression1() {
        currenttokens = lookahead.getToken();
        if (currenttokens == Tokens.IGUAL
                || currenttokens == Tokens.DIFERENTE
                || currenttokens == Tokens.MENOR
                || currenttokens == Tokens.MENORIGUAL
                || currenttokens == Tokens.MAIORIGUAL
                || currenttokens == Tokens.MAIOR) {
            relationalOperator();
            simpleexpression();

        } else {
            empty();
        }
    }

    private void simpleexpression() {
        term();
        recur_simple_expression();
    }

    private void term() {
        unary();
        while (lookahead.getToken() == Tokens.VEZES
                || lookahead.getToken() == Tokens.DIVISAO
                || lookahead.getToken() == Tokens.DIV
                || lookahead.getToken() == Tokens.MOD
                || lookahead.getToken() == Tokens.AND) {
            multi_operator();
            unary();
        }
    }

    private void factor() {

        if (currenttokens == Tokens.ID) {
            consume();
            if (currenttokens == Tokens.ABREPAR) {
                functiondesignator();
            } else if (currenttokens == Tokens.ABRECOCH) {
                variable();
            } else {
                //vazio
            }
        } else if (currenttokens == Tokens.NUMINT
                || currenttokens == Tokens.STRING || currenttokens == Tokens.NIL) {
            unsignedconstant();
        } else if (currenttokens == Tokens.ABRECOCH) {
            set();
        } else if (currenttokens == Tokens.ABREPAR) {

            //expression();
            if (currenttokens == Tokens.FECHAPAR) {
                consume();
            } else {
                error(Tokens.FECHAPAR, 1);
            }
        }
    }

    private void variable() {

        entireVariable();
        amb1();

    }

    private void indexedvariable() {
        identifier();
    }

    private void assignmentstatement() {

        variable();
        if (lookahead.getToken() == Tokens.ATRIB) {

            consume();
            expression();
        } else {
            error(Tokens.ATRIB, 1);
        }
    }

    private void amb1() {
        if (lookahead.getToken() == Tokens.ABRECOCH) {
            consume();
            expression();
            if (lookahead.getToken() == Tokens.FECHACOCH) {
                consume();
                // adcionar campos na taberla de simbolos
            } else {
                error(Tokens.FECHACOCH, 1);
            }
        }
    }

    private void procedurestatement() {

        procedureidentifier();
        amb2();
    }

    private void amb2() {
        if (currenttokens == Tokens.ABREPAR) {
            actualparameter();
            while (currenttokens == Tokens.VIRGULA) {
                actualparameter();

            }
            if (currenttokens == Tokens.FECHAPAR) {
                consume();
            } else {
                error(Tokens.FECHAPAR, 1);
            }
        } else {
            // vazio
        }

    }

    private void procedureidentifier() {
        identifier();
        //adcionar na tabela de simbolo dizendo que e um id de procedimento
    }

    private void actualparameter() {

        if (currenttokens == Tokens.ID) {
            variable();
            if (currenttokens == Tokens.VEZES
                    || currenttokens == Tokens.DIVISAO
                    || currenttokens == Tokens.MOD
                    || currenttokens == Tokens.AND) {
                expression();
            } else {
                variable();
            }
        } else if (currenttokens == Tokens.NUMINT
                || currenttokens == Tokens.STRING
                || currenttokens == Tokens.NIL
                || currenttokens == Tokens.ABRECOCH
                || currenttokens == Tokens.ABREPAR) {
            expression();
        }
    }

    private void functiondesignator() {
        functionidentifier();
        amb_designator();
    }

    private void unsignedconstant() {
        if (currenttokens == Tokens.NUMINT) {
            unsignedNumber();
        } else if (currenttokens == Tokens.STRING) {
            consume();
        } else if (currenttokens == Tokens.NIL) {
            consume();
        }

    }

    private void set() {
        consume();
        elementlist();
        if (currenttokens == Tokens.FECHAPAR) {
            consume();
        } else {
            error(Tokens.FECHAPAR, 1);
        }
    }

    private void recur_simple_expression() {
        addingOperator();
        term();
    }

    private void recur_term() {
        multiplyingOperator();
        factor();
    }

    private void amb_expression() {
        relationalOperator();
        simpleexpression();
    }

    private void functionidentifier() {
        identifier();
    }

    private void amb_designator() {
        if (currenttokens == Tokens.ABREPAR) {
            actualparameter();
            while (currenttokens == Tokens.VIRGULA) {
                consume();
                actualparameter();
                if (currenttokens == Tokens.FECHAPAR) {
                    consume();
                } else {
                    error(Tokens.FECHAPAR, 1);
                }
            }
        } else {
            //vazio
        }
    }

    private void elementlist() {
        element();
        while (currenttokens == Tokens.VIRGULA) {
            consume();
            element();
        }
    }

    private void element() {
        expression();
        amb_element();
    }

    private void amb_element() {
        if (currenttokens == Tokens.PONTOPONTO) {
            expression();
        } else {
            //vazioo
        }
    }

    private void expr_statement() {

        expression();

    }

    private void equality() {
        comparison();

        while (lookahead.getToken() == Tokens.IGUAL || lookahead.getToken() == Tokens.DIFERENTE) {
            eq_op();
            comparison();

        }
    }

    private void comparison() {

        addition();
        while (lookahead.getToken() == Tokens.MAIOR
                || lookahead.getToken() == Tokens.MAIORIGUAL
                || lookahead.getToken() == Tokens.MENOR
                || lookahead.getToken() == Tokens.MENORIGUAL) {
            comp_op();
            addition();
        }

    }

    private void eq_op() {
        consume();
    }

    private void addition() {
        term();
        while (lookahead.getToken() == Tokens.MENOS || lookahead.getToken() == Tokens.MAIS || lookahead.getToken() == Tokens.OR) {
            add_operator();
            term();
        }
    }

    private void comp_op() {
        consume();
    }

    private void add_operator() {
        consume();
    }

    private void unary() {

        if (lookahead.getToken() == Tokens.MAIS
                || lookahead.getToken() == Tokens.MENOS
                || lookahead.getToken() == Tokens.NOT) {
            consume();
            unary();
        } else {
            primary();
        }
    }

    private void primary() {
        String aux = "";
        if (lookahead.getToken() == Tokens.REAL
                || lookahead.getToken() == Tokens.NUMINT
                || lookahead.getToken() == Tokens.STRING
                || lookahead.getToken() == Tokens.NIL) {

            consume();

        } else if (lookahead.getToken() == Tokens.ID) {
            if (variavelver.variavel.contains(lookahead.getLexema())) {
                aux = lookahead.getLexema();
            } else {

                naodeclarada(lookahead.getLexema());
            }
            consume();
            if (lookahead.getToken() != Tokens.ATRIB) {

                return;
            }
            consume();
            if (lookahead.getToken() == Tokens.NUMINT) {

                if (!arrayInteger.contains(aux) && variavelver.variavel.contains(aux)) {
                    imcompativeis(lookahead.getLinha());
                }
            } else if (lookahead.getToken() == Tokens.NUMREAL) {

                if (!arrayReal.contains(aux) && variavelver.variavel.contains(aux)) {

                    imcompativeis(lookahead.getLinha());
                }
            }
            System.out.println(lookahead.getToken());
            expression();
        } else if (lookahead.getToken() == Tokens.ABREPAR) {
            consume();
            expression();
            if (lookahead.getToken() == Tokens.FECHAPAR) {
                consume();
            } else {
                error(Tokens.FECHAPAR, 1);
            }
        } else if (lookahead.getToken() == Tokens.ABRECHAV) {
            set();
        } else {
            error(Tokens.IDANDNUM, 1);
        }

    }

    private void multi_operator() {
        consume();
    }

    private void conditionalstatement() {
        if (lookahead.getToken() == Tokens.IF) {
            ifstatement();
        } else if (lookahead.getToken() == Tokens.CASE) {
            casestatement();
        }
    }

    private void repeatitivestatement() {
        if (lookahead.getToken() == Tokens.WHILE) {
            whilestatement();
        } else if (lookahead.getToken() == Tokens.REPEAT) {
            repeatstatement();
        } else if (lookahead.getToken() == Tokens.FOR) {
            forstatement();

        }
    }

    private void ifstatement() {

        consume();
        expression();
        if (lookahead.getToken() == Tokens.THEN) {

            consume();
            statement();
            consume();
            ifstatement2();

        } else {
            error(Tokens.THEN, 1);
        }
    }

    private void ifstatement2() {

        if (lookahead.getToken() == Tokens.ELSE) {
            consume();

            statement();
        }
    }

    private void casestatement() {
        consume();
        expression();
        if (lookahead.getToken() == Tokens.OF) {
            consume();
            caselistelement();
            while (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                consume();
                caselistelement();
            }

        } else {
            error(Tokens.OF, 1);
        }
    }

    private void caselistelement() {
        caselablelist();
        if (lookahead.getToken() == Tokens.PONTO) {
            consume();
            statement();
        }
    }

    private void caselable() {
        if (lookahead.getToken() == Tokens.NUMINT) {
            consume();

        } else {
            error(Tokens.NUMINT, 1);
        }
    }

    private void caselablelist() {
        caselable();
        while (lookahead.getToken() == Tokens.VIRGULA) {
            caselable();
        }
    }

    private void forstatement() {
        if (lookahead.getToken() == Tokens.FOR) {
            consume();
            identifier();
            if (lookahead.getToken() == Tokens.ATRIB) {
                consume();
                forlist();
                if (lookahead.getToken() == Tokens.DO) {
                    consume();
                    statement();
                } else {
                    error(Tokens.DO, 1);
                }
            } else {
                error(Tokens.ATRIB, 1);
            }
        }
    }

    private void forlist() {
        expression();
        foramb1();
    }

    private void foramb1() {
        if (lookahead.getToken() == Tokens.TO) {
            consume();
            expression();
        } else if (lookahead.getToken() == Tokens.DOWNTO) {
            consume();
            expression();
        }

    }

    private void whilestatement() {
        consume();
        expression();
        if (lookahead.getToken() == Tokens.DO) {

            consume();
            // statement();
            compoundstatement();
        } else {
            error(Tokens.DO, 1);
        }

    }

    private void repeatstatement() {
        consume();
        statement();
        while (lookahead.getToken() == Tokens.VIRGULA) {
            consume();
            statement();
        }
        if (lookahead.getToken() == Tokens.UNTIL) {
            consume();
            expression();
        } else {
            error(Tokens.UNTIL, 1);
        }
    }

    private void procedureandfunctiondeclarationpaart() {
        if (lookahead.getToken() == Tokens.FUNCTION) {
            functiondeclaration();
        } else if (lookahead.getToken() == Tokens.PROCEDURE) {
            proceduredeclaration2();
        }
    }

    private void functiondeclaration() {
        function_heading();
        block();
    }

    private void function_heading() {
        consume();
        if (lookahead.getToken() == Tokens.ID) {
            consume();
            if (lookahead.getToken() == Tokens.DOISPONTOS) {
                consume();
                type1();
                if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();
                } else {
                    error(Tokens.PONTOVIRGULA, 1);
                }
            } else if (lookahead.getToken() == Tokens.ABREPAR) {
                consume();
                formalparametersection();
                while (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();
                    formalparametersection();
                }
                if (lookahead.getToken() == Tokens.FECHAPAR) {
                    consume();
                    if (lookahead.getToken() == Tokens.DOISPONTOS) {
                        consume();
                        type1();
                        if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                            consume();
                        } else {
                            error(Tokens.PONTOVIRGULA, 1);
                        }
                    } else {
                        error(Tokens.DOISPONTOS, 1);
                    }

                }
            }
        } else {
            error(Tokens.ID, 1);
        }
    }

    private void procedure_heading() {
        consume();
        if (lookahead.getToken() == Tokens.ID) {
            consume();
            if (lookahead.getToken() == Tokens.DOISPONTOS) {
                consume();
                type1();
                if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();
                } else {
                    error(Tokens.PONTOVIRGULA, 1);
                }
            } else if (lookahead.getToken() == Tokens.ABREPAR) {
                consume();
                formalparametersection();
                while (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                    consume();
                    formalparametersection();
                }
                if (lookahead.getToken() == Tokens.FECHAPAR) {
                    consume();
                    if (lookahead.getToken() == Tokens.PONTOVIRGULA) {
                        consume();
                    } else {
                        error(Tokens.PONTOVIRGULA, 1);
                    }
                }
            }
        } else {
            error(Tokens.ID, 1);
        }
    }

    private void formalparametersection() {
        if (lookahead.getToken() == Tokens.ID) {
            parametergroup();
        } else if (lookahead.getToken() == Tokens.VAR) {
            consume();
            parametergroup();

        } else if (lookahead.getToken() == Tokens.FUNCTION) {
            consume();
            parametergroup();

        } else if (lookahead.getToken() == Tokens.PROCEDURE) {
            consume();
            identifier();
            while (lookahead.getToken() == Tokens.VIRGULA) {
                identifier();
            }

        }
    }

    private void proceduredeclaration2() {
        procedure_heading();
        block();
    }

    private void parametergroup() {
        if (lookahead.getToken() == Tokens.ID) {
            consume();
            while (lookahead.getToken() == Tokens.VIRGULA) {
                consume();
                identifier();
            }
            if (lookahead.getToken() == Tokens.DOISPONTOS) {
                consume();
                type1();
            } else {
                error(Tokens.ID, 1);
            }
        } else {
            error(Tokens.ID, 1);
        }
    }

}
