package milestone1;

public class product {
   public int id;
   public String name;
   public boolean promoted;
   public double price;
   public product next, prev;
   public product(int id, String name, int price, boolean promoted ){
    this.id =id;
    this.name = name;
    this.price =price;
    this.promoted =promoted;
    this.next = null;
    this.prev =null;
   }
}
