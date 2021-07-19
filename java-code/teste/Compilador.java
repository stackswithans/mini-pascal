/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

import java.io.IOException;
import static teste.Parser.listaerro;

/**
 *
 * @author hairt
 */
public class Compilador {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        // TODO code application logic here
        Analex analisador = new Analex();

        try {
            analisador.abreArquivo("teste1.txt");
            Parser p = new Parser("teste1.txt");
            Token token;
            token = analisador.getToken();

            System.out.println("------------------------------------------");
            System.out.println("LINHA              LEXEMA            TOKEN");
            System.out.println("------------------------------------------");

            while (token.getToken() != Tokens.EOF) {

                System.out.println("  " + token.getLinha() + "                " + token.getLexema() + "             " + token);

                token = analisador.getToken();

            }
            System.out.println(token);

            System.out.println("------------------------------------------");
            p.parser();
            
            System.out.println("                                          ");
            System.out.println("                                          ");
            System.out.println("                                          ");
            System.out.println("------------------------------------------");
            System.out.println("             LISTA DE ERROS               ");
            System.out.println("------------------------------------------");
            for (String string : listaerro) {
                System.out.println(string);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
