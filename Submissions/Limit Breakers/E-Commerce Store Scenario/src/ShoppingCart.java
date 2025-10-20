import java.util.ArrayList;

public class ShoppingCart {
    private HashTable cartItems;
    private CartActionStack undoStack;
    private OrderQueue orderQueue;
    public ArrayList<String> pID=new ArrayList<>();
    public ShoppingCart() {
        cartItems = new HashTable();
        undoStack = new CartActionStack();
        orderQueue = new OrderQueue();
    }

    public void addProduct(String productId, int qty) {
        Integer prevQty = (Integer) cartItems.get(productId);
        if (prevQty == null) prevQty = 0;
        pID.add(productId);
        cartItems.put(productId, prevQty + qty);
        undoStack.push(new CartAction("ADD", productId, prevQty, prevQty + qty));
        System.out.println("Product Added: " + productId + " Qty: " + qty);
    }

    public void removeProduct(String productId) {
        Integer prevQty = (Integer) cartItems.get(productId);
        if (prevQty == null) {
            System.out.println("Product not found in cart.");
            return;
        }
        cartItems.remove(productId);
        undoStack.push(new CartAction("REMOVE", productId, prevQty, 0));
        System.out.println("Product Removed: " + productId);
    }

    public void updateQuantity(String productId, int newQty) {
        Integer prevQty = (Integer) cartItems.get(productId);
        if (prevQty == null) {
            System.out.println("Product not found.");
            return;
        }
        cartItems.put(productId, newQty);
        undoStack.push(new CartAction("UPDATE", productId, prevQty, newQty));
        System.out.println("Updated " + productId + " from " + prevQty + " to " + newQty);
    }

    public void pushCartAction(CartAction action) {
        undoStack.push(action);
    }

    public void undoLastAction() {
        if (undoStack.isEmpty()) {
            System.out.println("No actions to undo.");
            return;
        }

        CartAction last = undoStack.pop();
        switch (last.type) {
            case "ADD":
                if (last.previousQuantity == 0) cartItems.remove(last.productId);
                else cartItems.put(last.productId, last.previousQuantity);
                System.out.println("Undid ADD → Restored qty: " + last.previousQuantity);
                break;
            case "REMOVE":
                cartItems.put(last.productId, last.previousQuantity);
                System.out.println("Undid REMOVE → Restored product with qty: " + last.previousQuantity);
                break;
            case "UPDATE":
                cartItems.put(last.productId, last.previousQuantity);
                System.out.println("Undid UPDATE → Restored qty: " + last.previousQuantity);
                break;
        }
    }

    public void enqueueOrder(String orderId, boolean vipFlag) {
        if(pID.isEmpty())return;
        Order order=new Order(orderId,vipFlag);
        for (int i = 0; i <pID.size() ; i++) {
            order.orders.add(pID.get(i));
        }
        orderQueue.enqueue(order);
        System.out.println("Enqueued Order: " + order );
        pID.clear();
        undoStack = new CartActionStack();
    }

    public void processNextOrder() {
        Order next = orderQueue.dequeue();
        if (next == null) {
            System.out.println("No orders to process.");
            return;
        }
        System.out.println("Processing Order → " + next);
    }

    public void showCart() {
        System.out.println("\nCart Items:");
        boolean empty = true;
        for (int i = 0; i < cartItems.entries.length; i++) {
            HashTable.Entry e = cartItems.entries[i];
            while (e != null) {
                System.out.println("  " + e.key + " → Qty: " + e.value);
                e = e.next;
                empty = false;
            }
        }
        if (empty) System.out.println("  (Empty)");
    }

    public void showOrderQueue() {
        orderQueue.showQueue();
    }
}

class OrderQueue {
    private static class Node {
        Order order;
        Node next;
        Node(Order order) { this.order = order; }
    }

    private Node front, rear;

    // Enqueue order with VIP priority
    public void enqueue(Order order) {
        Node newNode = new Node(order);

        if (front == null) { // empty queue
            front = rear = newNode;
        }
        else if (order.isVIP) {
            // VIP orders can jump ahead by 1 position (not to the very front)
            if (front == rear) { // only one order
                newNode.next = front;
                front = newNode;
            } else {
                Node temp = front;
                // Move until the node before rear
                while (temp.next != rear) {
                    temp = temp.next;
                }
                // Insert before last node
                newNode.next = rear;
                temp.next = newNode;
            }
        }
        else {
            // Normal order → end of queue
            rear.next = newNode;
            rear = newNode;
        }
    }

    // Process (dequeue) next order
    public Order dequeue() {
        if (front == null) return null;
        Order order = front.order;
        front = front.next;
        if (front == null) rear = null;
        return order;
    }

    public boolean isEmpty() {
        return front == null;
    }

    // Just to display current queue
    public void showQueue() {
        Node temp = front;
        System.out.println("\nCurrent Order Queue:");
        if (temp == null) {
            System.out.println("  (Empty)");
            return;
        }
        while (temp != null) {
            System.out.println("  " + temp.order);
            temp = temp.next;
        }
    }
}

 class Order {
    String orderId;
    ArrayList<String> orders=new ArrayList<>();
    boolean isVIP;
    public Order(String orderId, boolean isVIP) {
        this.orderId = orderId;
        this.isVIP = isVIP;
    }

     @Override
     public String toString() {
         return "Order: " +
                 "orderId='" + orderId + '\'' +
                 ", orders=" + orders +
                 ", isVIP=" + isVIP;
     }
 }

class CartAction {
    String type;         // "ADD", "REMOVE", "UPDATE"
    String productId;
    int previousQuantity;
    int newQuantity;

    public CartAction(String type, String productId, int previousQuantity, int newQuantity) {
        this.type = type;
        this.productId = productId;
        this.previousQuantity = previousQuantity;
        this.newQuantity = newQuantity;
    }

    public String toString() {
        return type + "ProductID: " + productId + "\nPrev: " + previousQuantity + "\nNew: " + newQuantity;
    }
}

class CartActionStack {
    private class Node {
        CartAction action;
        Node next;
        Node(CartAction action, Node next) {
            this.action = action;
            this.next = next;
        }
    }

    private Node top;
    private int size;

    public void push(CartAction action) {
        top = new Node(action, top);
        size++;
    }

    public CartAction pop() {
        if (isEmpty()) throw new IllegalStateException("Stack Empty");
        CartAction temp = top.action;
        top = top.next;
        size--;
        return temp;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public CartAction peek() {
        if (isEmpty()) throw new IllegalStateException("Stack Empty");
        return top.action;
    }

    public void undoLastKActions(int k) {
        for (int i = 0; i < k && !isEmpty(); i++) {
            CartAction last = pop();
            // same undo logic as in undoLastAction()
        }
    }
}

class HashTable {
    public Entry[] entries;
    private int size;
    private float loadFactor;

    public HashTable(int capacity, float loadFactor) {
        entries = new Entry[capacity];
        this.loadFactor = loadFactor;
    }

    public HashTable(int capacity) {
        this(capacity, 0.75F);
    }

    public HashTable() {
        this(101);
    }

    public Object get(Object key) {
        int h = hash(key);
        for (Entry e = entries[h]; e != null; e = e.next) {
            if (e.key.equals(key)) return e.value; // success
        }
        return null; // failure: key not found
    }

    public Object put(Object key, Object value) {
        int h = hash(key);
        for (Entry e = entries[h]; e != null; e = e.next) {
            if (e.key.equals(key)) {
                Object oldValue = e.value;
                e.value = value;
                return oldValue; // successful update
            }
        }
        entries[h] = new Entry(key, value, entries[h]);
        ++size;

        if (size > loadFactor * entries.length) rehash();
        return null; // successful insertion
    }

    public Object remove(Object key) {
        int h = hash(key);
        for (Entry e = entries[h], prev = null; e != null; prev = e, e = e.next) {
            if (e.key.equals(key)) {
                Object oldValue = e.value;
                if (prev == null) entries[h] = e.next;
                else prev.next = e.next;
                --size;
                return oldValue;
            }
        }
        return null;
    }

    private int hash(Object key) {
        return (key.hashCode() & 0x7FFFFFFF) % entries.length;
    }

    private void rehash() {
        Entry[] oldEntries = entries;
        entries = new Entry[oldEntries.length * 2 + 1];
        size = 0;
        for (int i = 0; i < oldEntries.length; i++) {
            for (Entry e = oldEntries[i]; e != null; e = e.next) {
                put(e.key, e.value);
            }
        }
    }

    public static class Entry {
        Object key;
        Object value;
        Entry next;

        Entry(Object key, Object value, Entry next) {
            this.key = key;
            this.value = value;
            this.next = next;
        }
    }
}
