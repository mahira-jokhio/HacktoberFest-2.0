class CustomerDB {
    String customerId;
    String name;
    int purchaseCount; // used for promotion heuristic
    String email;

    public CustomerDB(String customerId, String name, String email) {
        this.customerId = customerId;
        this.name = name;
        this.email = email;
        this.purchaseCount = 0;
    }

    public void incrementPurchases() {
        purchaseCount++;
    }

    public String toString() {
        return "CustomerID=" + customerId + ", Name=" + name + ", Purchases=" + purchaseCount;
    }
}

class CustomerNode {
    CustomerDB data;
    CustomerNode left, right;

    public CustomerNode(CustomerDB data) {
        this.data = data;
    }
}

class CustomerBST {
    private CustomerNode root;

    public void addCustomer(CustomerDB profile) {
        root = insert(root, profile.customerId, profile);
    }

    private CustomerNode insert(CustomerNode node, String id, CustomerDB profile) {
        if (node == null) return new CustomerNode(profile);
        if (id.compareTo(node.data.customerId) < 0)
            node.left = insert(node.left, id, profile);
        else if (id.compareTo(node.data.customerId) > 0)
            node.right = insert(node.right, id, profile);
        return node;
    }

    public CustomerDB findCustomer(String id) {
        CustomerNode node = find(root, id);
        return (node != null) ? node.data : null;
    }

    private CustomerNode find(CustomerNode node, String id) {
        if (node == null || node.data.customerId.equals(id)) return node;
        if (id.compareTo(node.data.customerId) < 0) return find(node.left, id);
        else return find(node.right, id);
    }

    public void deleteCustomer(String id) {
        root = delete(root, id);
    }

    private CustomerNode delete(CustomerNode node, String id) {
        if (node == null) return null;

        if (id.compareTo(node.data.customerId) < 0)
            node.left = delete(node.left, id);
        else if (id.compareTo(node.data.customerId) > 0)
            node.right = delete(node.right, id);
        else {
            if (node.left == null) return node.right;
            if (node.right == null) return node.left;
            CustomerNode min = findMin(node.right);
            node.data = min.data;
            node.right = delete(node.right, min.data.customerId);
        }
        return node;
    }

    private CustomerNode findMin(CustomerNode node) {
        while (node.left != null) node = node.left;
        return node;
    }

    public void promoteHotCustomer(String id) {
        CustomerNode parent = null;
        CustomerNode node = root;

        while (node != null && !node.data.customerId.equals(id)) {
            parent = node;
            if (id.compareTo(node.data.customerId) < 0) node = node.left;
            else node = node.right;
        }

        if (node == null) {
            System.out.println("Customer not found for promotion.");
            return;
        }

        if (parent != null && parent.left == node) {
            parent.left = node.right;
            node.right = parent;

            if (root == parent) root = node;
            System.out.println("Promoted hot customer " + id + " closer to root.");
        } else if (parent != null && parent.right == node) {
            parent.right = node.left;
            node.left = parent;
            if (root == parent) root = node;
            System.out.println("Promoted hot customer " + id + " closer to root.");
        } else {
            System.out.println("Customer already at root.");
        }
    }

    public void display() {
        System.out.println("\nCustomer BST (Inorder):");
        inorder(root);
    }

    private void inorder(CustomerNode node) {
        if (node == null) return;
        inorder(node.left);
        System.out.println("  " + node.data);
        inorder(node.right);
    }
}