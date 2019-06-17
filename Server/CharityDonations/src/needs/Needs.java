package needs;

import java.util.ArrayList;

public class Needs {
    private ArrayList<Item> needs;

    public Needs() {
        this.needs = new ArrayList<>();
    }

    public ArrayList<Item> getNeeds() {
        return needs;
    }

    public void setNeeds(ArrayList<Item> needs) {
        this.needs = needs;
    }

    public void addNeeds(Item need) {
        this.needs.add(need);
    }
}
