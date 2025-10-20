package milestone3;

public class costumertest {
    public static void main(String[] args) {
        
    
    costumerBST bst = new costumerBST();
    bst.addcostumer("ali", 01, 30);
    bst.addcostumer("qasim", 02, 40);
    bst.addcostumer("shah", 03, 12);
    bst.delete(01);
    System.out.println(bst.findcostumer(2));
     System.out.println("\nBefore Promotion:");
        bst.inOrder();

        // Promote a frequent buyer
        bst.promoteHotCustomer(40);
        bst.promoteHotCustomer(40); // promote twice for effect
        System.out.println("\nAfter Promotion of Hot Customer (Eve):");
        bst.inOrder();
    }
}
