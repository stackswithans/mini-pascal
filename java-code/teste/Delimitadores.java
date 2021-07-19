/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package teste;

/**
 *
 * @author hairt
 */
 public class Delimitadores {
    public static boolean isDelimiter(char ch)
    {
        return ch == '+' || ch == '-' || ch == '*' || ch == '/' || ch == '&' || ch == '|' ||
                ch == '(' || ch == ')' || ch == '[' || ch == ']' || ch == '{' || ch == '}' ||
                ch == ';' || ch == ',' || ch == '~' || ch == '^' || ch == ' ' || ch == '=' ||
                ch == '<' || ch == '>' || ch == '!' || ch == '\n' || ch == '\t' || ch == '"' || ch == '%';
    }
}
