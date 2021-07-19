/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

/**
 *
 * objectivo é que armazena cada palavra
 */
public class Token {
    private Tokens token;
    private String lexema;
    private int linha;

    public Tokens getToken() {
        return token;
    }

    public void setToken(Tokens token) {
        this.token = token;
    }

    public String getLexema() {
        return lexema;
    }

    public void setLexema(String lexema) {
        this.lexema = lexema;
    }

    public int getLinha() {
        return linha;
    }

    public void setLinha(int linha) {
        this.linha = linha;
    }

    public Token(Tokens token, String lexema, int linha) {
        this.token = token;
        this.lexema = lexema;
        this.linha = linha;
    }
     @Override
    public boolean equals(Object o)
    {
        if(this == o) return true;
        if(o == null || getClass() != o.getClass()) return false;

        Token token1 = (Token) o;

        if(linha != token1.linha) return false;
        if(token != token1.token) return false;
        return lexema.equals(token1.lexema);
    }

    @Override
    public int hashCode()
    {
        int result = token.hashCode();
        result = 31 * result + lexema.hashCode();
        result = 31 * result + linha;
        return result;
    }
    
    @Override
    public String toString()
    {
        return token.name();
    }
}
