package milestone2;

public class DemoCart {
    public static void main(String[] args) {
        cart cart = new cart();

        cart.add("Laptop", 1);
        cart.add("Mouse", 2);
        cart.changeQuantity("Mouse", 4);
        cart.showCart();

        cart.undoLastAction();
        cart.showCart();

        orderqueue q = new orderqueue();
        q.enqueueOrder("Order#1", false);
        q.enqueueOrder("Order#2", true);   // VIP jump
        q.enqueueOrder("Order#3", false);
        q.showQueue();
        q.processNextOrder();
        q.showQueue();
    }
}
