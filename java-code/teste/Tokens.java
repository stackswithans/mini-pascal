/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

public enum Tokens {
    ATRIB, NUMINT, NUMREAL, DIVISAO, ID, EOF, ERRO, IGUAL, MENOR, DIFERENTE, MENORIGUAL, MAIOR, MAIORIGUAL,
    MAIS, MENOS, VEZES, PONTO, PONTOPONTO, DOISPONTOS, DOISPONTOSIGUAL, ABREPAR, ABRECHAV, FECHACHAV,
    ABREFECHAPAR, FECHAPAR, ABRECOCH, FECHACOCH, VIRGULA, BARRAN, PONTOVIRGULA,
    BARRA, TIL, ARROBA, CIFRAO, SUSTENIDO, MAISIGUAL, MENOSIGUAL, VEZESIGUAL, BARRAIGUAL,
    ABRECOMENTARIO, FECHACOMENTARIO, ABREPARPONTO, PONTOFECHAPAR, BARRABARRA, UNDER, TABULACAO,
    ABSOLUTE, ELSE, NIL, SET, AND, END, NOT, SHL, ARRAY, OBJECT, SHR, ASM, FOR, OF, STRING, INT, REAL, DOUBLE, CHAR, BOOL, CONSTANTE, BEGIN, FUNCTION,
    ON, THEN, BREAK, GOTO, OPERATOR, TO, CASE, IF, OR, TYPE, CONST, IMPLEMENTATION, PACKED, UNIT,
    CONSTRUCTOR, IN, PROCEDURE, UNTIL, CONTINUE, INHERITED, PROGRAM, USES, DESTRUCTOR,
    INLINE, RECORD, VAR, DIV, INTERFACE, REINTRODUCE, WHILE, DO, LABEL, STR, REPEAT, WITH,
    DOWNTO, MOD, SELF, XOR, AS, CLASS, EXCEPT, EXPORTS, FINALIZATION, FINALLY, INITIALIZATION,
    IS, LIBRARY, OUT, PROPERTY, RAISE, THREADVAR, TRY, DISPOSE, FALSE, TRUE, EXIT, NEW, OTHERWISE, WRITELN, READLN, IDANDNUM, TIPODADO;

    @Override
    public String toString() {
        switch (this) {
            case ERRO:
                return "Token inválido";
            case TIPODADO:
                return "TIPO DADO";
            case IDANDNUM:
                return "Identificador ou numero";
            case WRITELN:
                return "Token Writeln";
            case READLN:
                return "Token Readln";
            case ABRECHAV:
                return "ABRE CHAV";
            case FECHACHAV:
                return "FECHA CHAV";
            case EOF:
                return "Final Arquivo";
            case IGUAL:
                return "Operador '='";
            case DIVISAO:
                return "Operador '/'";
            case MENOR:
                return "Operador '<'";
            case MENORIGUAL:
                return "Operador '<='";
            case DIFERENTE:
                return "Operador '<>'";
            case MAIOR:
                return "Operador '>'";
            case MAIORIGUAL:
                return "Operador '>='";
            case MAIS:
                return "Operador '+'";
            case MENOS:
                return "Operador '-'";
            case VEZES:
                return "Operador '*'";
            case PONTO:
                return "Operador '.'";
            case PONTOPONTO:
                return "Operador '..'";
            case DOISPONTOS:
                return "Operador ':'";
            case ATRIB:
                return "Operador ':='";
            case ABREPAR:
                return "'('";
            case ABREFECHAPAR:
                return "'()'";
            case FECHAPAR:
                return "')'";
            case ABRECOCH:
                return "Operador '['";
            case FECHACOCH:
                return "Operador ']'";
            case VIRGULA:
                return "','";
            case BARRAN:
                return "Operador '\n'";
            case PONTOVIRGULA:
                return "';'";
            case BARRA:
                return "Operador '/'";
            case TIL:
                return "Operador '~'";
            case ARROBA:
                return "'@'";
            case CIFRAO:
                return "'$'";
            case SUSTENIDO:
                return "'#'";
            case MAISIGUAL:
                return "'+='";
            case MENOSIGUAL:
                return "'-='";
            case VEZESIGUAL:
                return "'*='";
            case BARRAIGUAL:
                return "'/='";
            case ABRECOMENTARIO:
                return "'(*'";
            case FECHACOMENTARIO:
                return "'*)'";
            case ABREPARPONTO:
                return "'(.'";
            case PONTOFECHAPAR:
                return "'.)'";
            case BARRABARRA:
                return "'//'";
            case UNDER:
                return "'_'";
            case TABULACAO:
                return "'\t'";
            case ID:
                return "Identificador";
            case ABSOLUTE:
                return "comando 'absolute'";
            case ELSE:
                return "comando 'else'";
            case NIL:
                return "comando 'nil'";
            case SET:
                return "comando 'set'";
            case AND:
                return "comando 'and'";
            case END:
                return "comando 'end'";
            case NOT:
                return "comando 'not'";
            case SHL:
                return "comando 'shl'";
            case ARRAY:
                return "comando 'array'";
            case OBJECT:
                return "comando 'object'";
            case SHR:
                return "comando 'shr'";
            case ASM:
                return "comando 'asm'";
            case FOR:
                return "comando 'for'";
            case OF:
                return "comando 'of'";
            case STRING:
                return "identificador 'string'";
            case INT:
                return "integer";
            case REAL:
                return "real";
            case DOUBLE:
                return "identificador 'double'";
            case CHAR:
                return "char";
            case BOOL:
                return "identificador 'boolean'";
            case CONST:
                return "comando 'const'";
            case BEGIN:
                return "comando 'begin'";
            case FUNCTION:
                return "comando 'function'";
            case ON:
                return "comando 'on'";
            case THEN:
                return "comando 'then'";
            case BREAK:
                return "comando 'break'";
            case GOTO:
                return "comando 'goto'";
            case OPERATOR:
                return "comando 'operator'";
            case TO:
                return "comando 'to'";
            case CASE:
                return "comando 'case'";
            case IF:
                return "comando 'if'";
            case OR:
                return "comando 'or'";
            case TYPE:
                return "comando 'type'";
            case IMPLEMENTATION:
                return "comando 'implementation'";
            case PACKED:
                return "comando 'packed'";
            case UNIT:
                return "comando 'unit'";
            case CONSTRUCTOR:
                return "comando 'constructor'";
            case IN:
                return "comando 'in'";
            case PROCEDURE:
                return "comando 'procedure'";
            case INHERITED:
                return "comando 'inherited'";
            case PROGRAM:
                return "comando 'program'";
            case USES:
                return "comando 'uses'";
            case DESTRUCTOR:
                return "comando 'destructor'";
            case INLINE:
                return "comando 'inline'";
            case RECORD:
                return "comando 'record'";
            case VAR:
                return "comando 'var'";
            case DIV:
                return "comando 'div'";
            case INTERFACE:
                return "comando 'interface'";
            case REINTRODUCE:
                return "comando 'reintroduce'";
            case WHILE:
                return "comando 'while'";
            case DO:
                return "comando 'do'";
            case LABEL:
                return "comando 'label'";
            case STR:
                return "string";
            case REPEAT:
                return "comando 'repeat'";
            case WITH:
                return "comando 'with'";
            case DOWNTO:
                return "comando 'downto'";
            case MOD:
                return "comando 'mod'";
            case SELF:
                return "comando 'self'";
            case XOR:
                return "comando 'xor'";
            case AS:
                return "comando 'as'";
            case CLASS:
                return "comando 'class'";
            case EXCEPT:
                return "comando 'except'";
            case EXPORTS:
                return "comando 'exports'";
            case FINALIZATION:
                return "comando 'finalization'";
            case FINALLY:
                return "comando 'finally'";
            case INITIALIZATION:
                return "comando 'initialization'";
            case IS:
                return "comando 'is'";
            case LIBRARY:
                return "comando 'library'";
            case OUT:
                return "comando 'out'";
            case RAISE:
                return "comando 'raise'";
            case THREADVAR:
                return "comando 'thereadvar'";
            case TRY:
                return "comando 'try'";
            case DISPOSE:
                return "comando 'dispose'";
            case FALSE:
                return "'false'";
            case TRUE:
                return "'true'";
            case EXIT:
                return "comando 'exit'";
            case NEW:
                return "comando 'new'";
            default:
                return " ";
        }
    }
}
