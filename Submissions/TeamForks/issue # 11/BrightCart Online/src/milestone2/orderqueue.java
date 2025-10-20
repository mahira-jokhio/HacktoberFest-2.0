 package milestone2;

import java.util.LinkedList;
import java.util.Queue;

public class orderqueue {
    private Queue<String> orders = new LinkedList<>();

    public void enqueueOrder(String order, boolean vip) {
        if (vip && orders.size() > 0) {
            
            String first = orders.poll();
            orders.add(order);
            orders.add(first);
            System.out.println("VIP order placed ahead: " + order);
        } else {
            orders.add(order);
            System.out.println("Order added: " + order);
        }
    }

    public void processNextOrder() {
        if (orders.isEmpty()) {
            System.out.println("No orders to process.");
            return;
        }
        String order = orders.poll();
        System.out.println("Processing order: " + order);
    }

    public void showQueue() {
        System.out.println(" Current order queue: " + orders);
    }

 {
    
}
}