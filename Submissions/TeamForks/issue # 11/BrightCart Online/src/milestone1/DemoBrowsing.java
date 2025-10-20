package milestone1;

public class DemoBrowsing {
    public static void main(String[] args) {
        productlist list = new productlist();

        product p1 = new product(1, "Shoes", 2000,false);
        product p2 = new product(2, "Phone",5000, true);
        product p3 = new product(3, "Watch",4000, false);
        product p4 = new product(4, "Laptop",200000, true);
        product p5 = new product(5, "Headphones", 2000,true);
        product p6 = new product(6, "Bag",1500, false);

        list.addtofront(p1);
        list.addtofront(p2);
        list.addtofront(p3);
        list.addtofront(p4);
        list.addtofront(p5);
        list.addtofront(p6);

        System.out.println("Initial carousel:");
        list.display();

        list.moveToFront(3);
        System.out.println("\nAfter moving product 3 to front:");
        list.display();

        list.removeProduct(2);
        System.out.println("\nAfter removing featured product 2:");
        list.display();

        list.validateCarousel();
        System.out.println("\nAfter validation:");
        list.display();
    }
}
