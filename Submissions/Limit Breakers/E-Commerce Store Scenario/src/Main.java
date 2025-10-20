import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        System.out.println("===== BrightCart E-Commerce Backend Prototype =====\n");

        ProductLists carousel = new ProductLists();
        ShoppingCart cart = new ShoppingCart();
        CustomerBST customerTree = new CustomerBST();
        RecommendationGraph recGraph = new RecommendationGraph();

        // Preload some products
        product p1 = new product("P001", "Coffee Mug", 9.99, true, "Kitchen", 20, 0.1f, 4.8f);
        product p2 = new product("P002", "Bluetooth Speaker", 29.99, false, "Electronics", 15, 0.0f, 4.5f);
        product p3 = new product("P003", "Notebook", 4.99, true, "Stationery", 50, 0.05f, 4.2f);
        product p4 = new product("P004", "Water Bottle", 7.49, false, "Fitness", 25, 0.0f, 4.3f);
        product p5 = new product("P005", "Wireless Mouse", 19.99, true, "Electronics", 30, 0.15f, 4.6f);

        carousel.addToEnd(p1);
        carousel.addToEnd(p2);
        carousel.addToFront(p3);
        carousel.addToEnd(p4);
        carousel.addToEnd(p5);

        // Preload recommendation graph
        recGraph.addRelation("P001", "P002");
        recGraph.addRelation("P001", "P005");
        recGraph.addRelation("P003", "P004");

        // Preload customers
        customerTree.addCustomer(new CustomerDB("C001", "Ahmed", "ahmed@gmail.com"));
        customerTree.addCustomer(new CustomerDB("C002", "Sayeel", "sayeel@gmail.com"));
        customerTree.addCustomer(new CustomerDB("C003", "Ali", "ali@gmail.com"));

        int choice = -1;
        while (choice != 0) {
            System.out.println("\n===== MAIN MENU =====");
            System.out.println("1. Manage Products (Carousel)");
            System.out.println("2. Manage Shopping Cart");
            System.out.println("3. Manage Orders");
            System.out.println("4. Manage Customers");
            System.out.println("5. Show Recommendation Graph");
            System.out.println("6. Get Product Recommendations");
            System.out.println("0. Exit");
            System.out.print("Enter your choice: ");
            choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    int prodChoice = -1;
                    while (prodChoice != 0) {
                        System.out.println("\n--- Product Carousel Menu ---");
                        System.out.println("1. Display Products");
                        System.out.println("2. Remove Product");
                        System.out.println("3. Move Product to Front");
                        System.out.println("0. Back");
                        System.out.print("Enter choice: ");
                        prodChoice = sc.nextInt();
                        sc.nextLine();

                        switch (prodChoice) {
                            case 1:
                                carousel.displayProduct();
                                break;
                            case 2:
                                System.out.print("Enter Product ID to remove: ");
                                String rid = sc.nextLine();
                                carousel.removeProduct(rid);
                                break;
                            case 3:
                                System.out.print("Enter Product ID to move to front: ");
                                String mid = sc.nextLine();
                                carousel.moveToFront(mid);
                                break;
                            case 0:
                                System.out.println("Returning to Main Menu...");
                                break;
                            default:
                                System.out.println("Invalid choice.");
                        }
                    }
                    break;

                case 2:
                    int cartChoice = -1;
                    while (cartChoice != 0) {
                        System.out.println("\n--- Shopping Cart Menu ---");
                        System.out.println("1. Add Product");
                        System.out.println("2. Remove Product");
                        System.out.println("3. Update Quantity");
                        System.out.println("4. Show Cart");
                        System.out.println("5. Undo Last Action");
                        System.out.println("0. Back");
                        System.out.print("Enter: ");
                        cartChoice = sc.nextInt();
                        sc.nextLine();

                        switch (cartChoice) {
                            case 1:
                                System.out.print("Enter Product ID: ");
                                String pid = sc.nextLine();
                                System.out.print("Enter Quantity: ");
                                int qty = sc.nextInt();
                                sc.nextLine();
                                cart.addProduct(pid, qty);
                                break;
                            case 2:
                                System.out.print("Enter Product ID to remove: ");
                                pid = sc.nextLine();
                                cart.removeProduct(pid);
                                break;
                            case 3:
                                System.out.print("Enter Product ID: ");
                                pid = sc.nextLine();
                                System.out.print("Enter new Quantity: ");
                                int newQty = sc.nextInt();
                                sc.nextLine();
                                cart.updateQuantity(pid, newQty);
                                break;
                            case 4:
                                cart.showCart();
                                break;
                            case 5:
                                cart.undoLastAction();
                                break;
                            case 0:
                                System.out.println("Returning...");
                                break;
                            default:
                                System.out.println("Invalid option.");
                        }
                    }
                    break;

                case 3:
                    int orderChoice = -1;
                    while (orderChoice != 0) {
                        System.out.println("\n--- Order Menu ---");
                        System.out.println("1. Place Order");
                        System.out.println("2. Process Next Order");
                        System.out.println("3. Show Order Queue");
                        System.out.println("0. Back");
                        System.out.print("Enter: ");
                        orderChoice = sc.nextInt();
                        sc.nextLine();

                        switch (orderChoice) {
                            case 1:
                                if(cart.pID.isEmpty()){
                                    System.out.println("Cart is Empty");
                                    break;
                                }
                                System.out.print("Enter Order ID: ");
                                String oid = sc.nextLine();
                                System.out.print("VIP Order? (true/false): ");
                                boolean vip = sc.nextBoolean();
                                sc.nextLine();
                                cart.enqueueOrder(oid, vip);
                                break;
                            case 2:
                                cart.processNextOrder();
                                break;
                            case 3:
                                cart.showOrderQueue();
                                break;
                            case 0:
                                System.out.println("Returning...");
                                break;
                            default:
                                System.out.println("Invalid choice.");
                        }
                    }
                    break;

                case 4:
                    int custChoice = -1;
                    while (custChoice != 0) {
                        System.out.println("\n--- Customer Menu ---");
                        System.out.println("1. Add Customer");
                        System.out.println("2. Display Customers");
                        System.out.println("3. Promote Hot Customer");
                        System.out.println("4. Delete Customer");
                        System.out.println("5. Find Customer");
                        System.out.println("0. Back");
                        System.out.print("Enter: ");
                        custChoice = sc.nextInt();
                        sc.nextLine();

                        switch (custChoice) {
                            case 1:
                                System.out.print("Enter ID: ");
                                String cid = sc.nextLine();
                                System.out.print("Enter Name: ");
                                String cname = sc.nextLine();
                                System.out.print("Enter Email: ");
                                String email = sc.nextLine();
                                customerTree.addCustomer(new CustomerDB(cid, cname, email));
                                break;
                            case 2:
                                customerTree.display();
                                break;
                            case 3:
                                System.out.print("Enter Customer ID to promote: ");
                                cid = sc.nextLine();
                                customerTree.promoteHotCustomer(cid);
                                break;
                            case 4:
                                System.out.print("Enter Customer ID to delete: ");
                                cid = sc.nextLine();
                                customerTree.deleteCustomer(cid);
                                break;
                            case 5:
                                System.out.print("Enter Customer ID to find: ");
                                cid = sc.nextLine();
                                System.out.println(customerTree.findCustomer(cid));
                                break;
                            case 0:
                                System.out.println("Returning...");
                                break;
                            default:
                                System.out.println("Invalid option.");
                        }
                    }
                    break;

                case 5:
                    recGraph.showGraph();
                    break;

                case 6:
                    System.out.print("Enter Product ID for recommendation: ");
                    String pid = sc.nextLine();
                    System.out.print("How many recommendations? ");
                    int k = sc.nextInt();
                    sc.nextLine();
                    System.out.println("Recommended: " + recGraph.recommendProducts(pid, k));
                    break;

                case 0:
                    System.out.println("Exiting Goodbye!");
                    break;

                default:
                    System.out.println("Invalid option! Try again.");
            }
        }

        sc.close();
    }
}
