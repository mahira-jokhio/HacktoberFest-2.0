package milestone3;

public class costumer {
    public String name;
    public int id;
    public int purchasecount;
    public costumer left, right;
    public costumer(String name, int id, int purchasecount ){
        this.name =name;
        this.id =id;
        this.purchasecount = purchasecount;
        this.left = null;
        this.right = null;
    }
    
}
