package needs;

import java.util.ArrayList;

/**
 *  Classe que define os atributos e metodos de um Needs especificando a lista de Items necessitados.
 */
public class Needs {
    private ArrayList<Item> needs;

    /**
     * Constructor da classe Needs, simplesmente iniciliza seus atributos;
     */
    public Needs() {
        this.needs = new ArrayList<>();
    }

    /**
     *  getter do atributo needs.
     * @return ArrayList(item) - need de Needs.
     */
    public ArrayList<Item> getNeeds() {
        return needs;
    }

    /**
     *  Setter de needs, atribui o valor desejado ao atibuto.
     * @param needs valor desejado para o atributo needs.
     */
    public void setNeeds(ArrayList<Item> needs) {
        this.needs = needs;
    }
}
