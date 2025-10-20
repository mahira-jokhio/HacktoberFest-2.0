package milestone3;

public class costumerBST {
    private costumer root;
    public void addcostumer(String name, int id, int purchasecount){
        inserthelper(root, name,id,purchasecount);

    }
    public costumer inserthelper(costumer root, String name, int id, int purchasecount){
        if(root == null){
             return new costumer(name,id,purchasecount);
        }
        if(id< root.id){
            root.left = inserthelper(root,name, id ,purchasecount);
        }
        
       else if(id> root.id){
        root.right =  inserthelper(root, name, id, purchasecount);
       } 
        return root;
       
    }
    public costumer findcostumer(int id){
       return find(root, id);
    }
    public costumer find(costumer node, int id){
        if(node == null) return null;
       if(node.id == id){
        return node;
       }
       if(node.id>id){
        find(node.left,id);
       }
       if (node.id<id) {
        find(node.right, id);
        
       }
       return node;
    }
    public void delete(int id){
        deletehelper(root,id);
    }
    public costumer deletehelper(costumer node, int id){
         if (node == null) {
            System.out.println("costumer ID " + id + " not found!");
            return null;
        }

        if (id < node.id) {
            node.left = deletehelper(node.left, id);
        } else if (id > node.id) {
            node.right = deletehelper(node.right, id);
        } else {
            System.out.println("Deleting customer ID " + id + " (" + node.name + ")");
            if (node.left == null) return node.right;
            else if (node.right == null) return node.left;

            costumer successor = findMin(node.right);
            node.id = successor.id;
            node.name = successor.name;
            node.purchasecount = successor.purchasecount;

            node.right = deletehelper(node.right, successor.id);
        }


        return node;
    }
      private costumer findMin(costumer node) {
        while (node.left != null)
            node = node.left;
        return node;
    }
    public void promoteHotCustomer(int id) {
    root = promoteRec(root, id);
}

private costumer promoteRec(costumer node, int id) {
    if (node == null) return null;

    if (id < node.id) {
        node.left = promoteRec(node.left, id);
        if (node.left != null && node.left.id == id) {
            node = rotateRight(node);
            System.out.println("Promoted hot customer " + id + " upward (right rotation).");
        }
    } else if (id > node.id) {
        node.right = promoteRec(node.right, id);
        if (node.right != null && node.right.id == id) {
            node = rotateLeft(node);
            System.out.println("Promoted hot customer " + id + " upward (left rotation).");
        }
    }
    return node;
}

private costumer rotateRight(costumer y) {
    costumer x = y.left;
    costumer t2 = x.right;
    x.right = y;
    y.left = t2;
    return x;
}

private costumer rotateLeft(costumer x) {
    costumer y = x.right;
    costumer t2 = y.left;
    y.left = x;
    x.right = t2;
    return y;
}
public void inOrder() {
    inOrderRec(root);
    System.out.println();
}

private void inOrderRec(costumer node) {
    if (node == null) return;
    inOrderRec(node.left);
    System.out.print("[" + node.id + ", " + node.name + ", " + node.purchasecount + "] ");
    inOrderRec(node.right);
}

}
