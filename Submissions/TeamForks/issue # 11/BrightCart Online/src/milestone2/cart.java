package milestone2;
import milestone2.cartaction;
import java.util.Stack;


import java.util.HashMap;

public class cart {
    HashMap<String, Integer> cartitem = new HashMap<>();
    Stack<cartaction> undo = new Stack<>();
    public void add(String name, int qty){
        cartitem.put(name, cartitem.getOrDefault(name, 0)+qty);
         undo.push(new cartaction("add",name, qty));
    }
    public void remove(String name){
        if(!cartitem.containsKey(name)) return;
     int oldqty = cartitem.get(name);
     undo.push(new cartaction("remove", name, oldqty));
    }
    public void changeQuantity(String name, int newQty) {
        if (!cartitem.containsKey(name)) return;
        int oldQty = cartitem.get(name);
        cartitem.put(name, newQty);
        undo.push(new cartaction("quantity", name, oldQty));
    }
     public void undoLastAction() {
        if (undo.isEmpty()) {
            System.out.println("Nothing to undo.");
            return;
        }

        cartaction action = undo.pop();

        switch (action.type) {
            case "add":
                int currentQty = cartitem.getOrDefault(action.name, 0);
                int newQty = currentQty - action.quantity;
                if (newQty <= 0) cartitem.remove(action.name);
                else cartitem.put(action.name, newQty);
                System.out.println("Undo add of " + action.name);
                break;

            case "remove":
                cartitem.put(action.name, action.quantity);
                System.out.println("Undo remove of " + action.name);
                break;

            case "quantity":
                cartitem.put(action.name, action.quantity);
                System.out.println("Undo quantity change for " + action.name);
                break;
        }
    }

    public void showCart() {
        System.out.println("Cart Items: " + cartitem);
    }
}

