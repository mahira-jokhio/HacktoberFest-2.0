public class ProductLists{
    private productNode head;  // first node
    private productNode tail;  // last node
    int size=0;

    private class productNode{
        product obj;
        productNode next;
        productNode prev;

        public productNode(product obj) {
            this.obj = obj;
        }

        public productNode(product obj, productNode next, productNode prev) {
            this.obj = obj;
            this.next = next;
            this.prev = prev;
        }
    }

    public int size() {
        return size;
    }

    public void addToFront(product obj) {
        productNode newNode =new productNode(obj);
        if (head == null) {
            head =newNode;
            tail =newNode;
        } else {
            newNode.next =head;
            head.prev =newNode;
            head =newNode;
        }
        size++;
        maintainFeaturedConstraint();
    }

    public void addToEnd(product obj) {
        productNode newNode =new productNode(obj);

        if (tail == null) {
            head =newNode;
            tail =newNode;
        } else {
            tail.next =newNode;
            newNode.prev =tail;
            tail =newNode;
        }
        size++;
        maintainFeaturedConstraint();
    }

    public product removeProduct(String productId){
        productNode temp=head;
        while (temp != null) {
            if (temp.obj.productId.equals(productId)) {
                product removedProduct = temp.obj;
                if (temp == head) {
                    head = head.next;
                    if (head != null) head.prev = null;
                }
                else if (temp == tail) {
                    tail = tail.prev;
                    tail.next = null;
                }
                else {
                    temp.prev.next = temp.next;
                    temp.next.prev = temp.prev;
                }
                size--;
                maintainFeaturedConstraint();
                return removedProduct;
            }
            temp = temp.next;
        }
        return null;
    }

    public void moveToFront(String productId){
        productNode temp=head;
        while (temp != null) {
            if (temp.obj.productId.equals(productId)) {
                if (temp == head) {
                    return;
                }
                product removedProduct = temp.obj;

                if (temp == tail) {
                    tail = tail.prev;
                    tail.next = null;
                }
                else {
                    temp.prev.next = temp.next;
                    temp.next.prev = temp.prev;
                }
                size--;
                addToFront(removedProduct);
                return;
            }
            temp = temp.next;
        }
    }

    public String validateCarousel() {
        productNode slow = head;
        productNode fast = head;

        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;

            if (slow == fast) {
                repairCycle(slow);
                return "REPAIRED";
            }
        }
        return "NO CYCLE FOUND";
    }

    private void repairCycle(productNode cycleStartPoint) {
        productNode start = head;
        productNode loopNode = cycleStartPoint;
        while (start != loopNode) {
            start = start.next;
            loopNode = loopNode.next;
        }
        productNode prev = start;
        while (prev.next != start) {
            prev = prev.next;
        }
        prev.next = null;
    }

    private void maintainFeaturedConstraint() {
        productNode temp = head;
        int count = 0;

        while (temp != null && count < 3) {
            if (!temp.obj.isFeatured) {
                productNode search = temp.next;
                while (search != null && !search.obj.isFeatured) {
                    search = search.next;
                }

                if (search != null) {
                    product toMaintain = search.obj;
                    removeProduct(toMaintain.productId);
                    addToFront(toMaintain);
                }
            }
            temp = temp.next;
            count++;
        }
    }

    public void displayProduct(){
        productNode temp=head;
        while (temp!=null){
            System.out.println(temp.obj);
            temp=temp.next;
        }
    }
}
class product{
    String productId;
    String productName;
    Double productPrice;
    boolean isFeatured;
    String productCategory;
    int stockQuantity;
    float discount;
    float rating;

    public product(String productId, String productName, Double productPrice, boolean isFeatured, String productCategory, int stockQuantity, float discount, float rating) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.isFeatured = isFeatured;
        this.productCategory = productCategory;
        this.stockQuantity = stockQuantity;
        this.discount = discount;
        this.rating = rating;
    }

    @Override
    public String toString() {
        return  "\nProduct Id= " + productId +
                "\nproductName= " + productName +
                "\nproductPrice=" + productPrice +
                "\nisFeatured=" + isFeatured +
                "\nproductCategory='" + productCategory +
                "\nstockQuantity=" + stockQuantity +
                "\ndiscount=" + discount +
                "\nrating=" + rating;
    }
}
