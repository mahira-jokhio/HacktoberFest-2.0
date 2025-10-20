import java.util.*;

class RecommendationGraph {
    private Map<String, Set<String>> adjacencyList = new HashMap<>();

  public void addRelation(String productA, String productB) {
        adjacencyList.putIfAbsent(productA, new HashSet<>());
        adjacencyList.putIfAbsent(productB, new HashSet<>());

        adjacencyList.get(productA).add(productB);
        adjacencyList.get(productB).add(productA);
    }

    public List<String> recommendProducts(String productId, int k) {
        Set<String> neighbors = adjacencyList.get(productId);
        if (neighbors == null) return Collections.emptyList();
        List<String> list = new ArrayList<>(neighbors);
        return list.subList(0, Math.min(k, list.size()));
    }

    public void showGraph() {
        System.out.println("\nRecommendation Graph:");
        for (String key : adjacencyList.keySet()) {
            System.out.println("  " + key + " → " + adjacencyList.get(key));
        }
    }
}
