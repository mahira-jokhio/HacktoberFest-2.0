package milestone1;
import milestone1.product;

public class productlist {
    private product head;
    private product tail;
    //Adding at first position 
    public void addtofront(product pro){
        if(head == null){
            head = pro;
            tail = pro;
            System.out.println("PRODUCT ADDED");
            return;
        }
      if(pro.promoted){
        int count = 0;
        product node = head;
        product prev = null;
        while(node != null && count < 3){
            if(!node.promoted){
                break;
            }
            prev = node;
            node = node.next;
            count++;
            }
        if(prev == null){
            pro.next = head;
            head.prev = pro;
            head = pro;
        }
        else{
            pro.next = prev.next;
            pro.prev = prev;
            if(prev.next != null){
                prev.next.prev =pro;
            }
            prev.next = pro;
        }
        if(pro.next == null ) tail = pro;
      }
      else{
        int count = 0;
        product last = null;
        product node = head;
        while(node != null && count<3){
             if(node.promoted){
                last = node;
             }
             node = node.next;
             count++;
        }
          if(last == null){
            head.next = pro;
            pro.prev = head;
            head = pro;
          }
          else{
            last.next = pro;
            pro.prev =last;
            if(last.next != null){
                last.prev.next = pro;
            }
            last.next = pro;
          }
          if(pro.next == null) tail =pro;

      }


        }    
    
    //Adding at last
    public void addtoend(product pro){
       if(head == null){
        head = pro;
        tail = head;
        System.out.println("product added");
        return;
       }

       pro.prev = tail;
       tail.next = pro;
       tail = pro; 
     System.out.println("product added");}
    // Remove product
    public void removeProduct(int proid){
        if(head == null){
            System.out.println("No products to remove");
            return;
        }

        product temp = head;
        while(temp.next!= null || temp.id != proid){
            temp = temp.next;
        }
        if(temp.prev != null){
            temp.prev.next = temp.next;
        }
        else{
        head.next = temp.next;}
        if(temp.next != null){
            temp.prev.next = temp.next;
        }
        else{
        temp.prev = tail;}
        
        if (temp.promoted) {
            int featuredCount = 0;
            product temp2 = head;
            int pos = 0;

            
            while (temp2 != null && pos < 3) {
                if (temp2.promoted) featuredCount++;
                temp2 = temp2.next;
                pos++;
            }

            if (featuredCount < 3) {
                
                product ptr = head;
                int skip = 0;
                while (ptr != null && skip < 3) {
                    ptr = ptr.next;
                    skip++;
                }

                while (ptr != null) {
                    if (ptr.promoted) {
                        System.out.println("Auto-promoting: " + ptr.name);
                    
                        if (ptr.prev != null) ptr.prev.next = ptr.next;
                        if (ptr.next != null) ptr.next.prev = ptr.prev;
                        if (ptr == tail) tail = ptr.prev;

                    
                        product second = head;
                        if (second != null) second = second.next;
                        if (second != null) {
                            ptr.next = second.next;
                            ptr.prev = second;
                            if (second.next != null)
                                second.next.prev = ptr;
                            second.next = ptr;
                            if (ptr.next == null)
                                tail = ptr;
                        }
                        break;
                    }
                    ptr = ptr.next;
                }
            }
        }
    }
    //move to front

public void moveToFront(int productId) {
    if (head == null) return;

    product current = head;

    // 1️⃣ Find product
    while (current != null && current.id != productId) {
        current = current.next;
    }

    if (current == null) {
        System.out.println("product not found: " + productId);
        return;
    }

    // 2️⃣ Already at correct position?
    if (current == head) {
        System.out.println("Already at front.");
        return;
    }

    // 3️⃣ Detach node from current place
    if (current.prev != null)
        current.prev.next = current.next;
    if (current.next != null)
        current.next.prev = current.prev;

    if (current == tail)
        tail = current.prev;

    current.prev = null;
    current.next = null;

    // 4️⃣ Reinsert at front depending on promotion
    if (current.promoted) {
        // same as featured insert among top 3
        product node = head;
        product prevNode = null;
        int count = 0;

        while (node != null && count < 3) {
            if (!node.promoted) break;
            prevNode = node;
            node = node.next;
            count++;
        }

        if (prevNode == null) {
            // insert at head
            current.next = head;
            head.prev = current;
            head = current;
        } else {
            current.next = prevNode.next;
            current.prev = prevNode;
            if (prevNode.next != null)
                prevNode.next.prev = current;
            prevNode.next = current;
            if (current.next == null)
                tail = current;
        }
    } else {
        // non-featured → insert after last featured in top 3
        product node = head;
        product lastFeatured = null;
        int pos = 0;
        while (node != null && pos < 3) {
            if (node.promoted) lastFeatured = node;
            node = node.next;
            pos++;
        }

        if (lastFeatured == null) {
            // no featured → move to true front
            current.next = head;
            head.prev = current;
            head = current;
        } else {
            // insert after last featured
            current.next = lastFeatured.next;
            current.prev = lastFeatured;
            if (lastFeatured.next != null)
                lastFeatured.next.prev = current;
            lastFeatured.next = current;
            if (current.next == null)
                tail = current;
        }
    }

    System.out.println("Moved " + current.name + " to front region.");
}
public void validateCarousel() {
    if (head == null) {
        System.out.println("Carousel is empty nothing to validate");
        return;
    }

    System.out.println(" Validating carousel");


    product slow = head;
    product fast = head;
    boolean hasCycle = false;

    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            hasCycle = true;
            break;
        }
    }

   
    if (hasCycle) {
        System.out.println("Cycle detected! Attempting to repair...");

        slow = head;
        product prev = null;

        while (slow != fast) {
            prev = fast;
            slow = slow.next;
            fast = fast.next;
        }

        
        System.out.println("Cycle starts at product ID: " + slow.id);

        if (prev != null) {
            prev.next = null;
            tail = prev;
        }

        System.out.println("Cycle removed.");
    }

   
    product node = head;
    product previous = null;
    while (node != null) {
        if (node.prev != previous) {
            node.prev = previous;
        }
        previous = node;
        if (node.next == null) {
            tail = node; 
        }
        node = node.next;
    }

    if (tail.next != null) tail.next = null;
    if (head.prev != null) head.prev = null;

    System.out.println(" Validation complete — structure OK.");
}
public void printproducts(){
    product temp = head;
    while(temp.next != null && temp == null){
        System.out.println(temp+ " ");
        temp = temp.next;
    }
}
public void display() {
    Product temp = head;
    if (temp == null) {
        System.out.println("Carousel is empty.");
        return;
    }

    System.out.print("Carousel: ");
    while (temp != null) {
        String tag = temp.promoted ? "[FEATURED]" : "";
        System.out.print("(" + temp.id + " " + temp.name + " " + tag + ") ");
        temp = temp.next;
    }
    System.out.println();
}
    }


