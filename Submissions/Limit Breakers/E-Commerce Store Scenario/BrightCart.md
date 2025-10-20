BrightCart - E-Commerce Backend System
</br>
📋 Project Overview</br>

BrightCart is a comprehensive Java-based e-commerce backend system that implements fundamental data structures and algorithms to manage products, customers, orders, and recommendations. This prototype demonstrates efficient inventory management, shopping cart functionality, and customer relationship management using custom-built data structures.

🏗️ System Architecture
📊 Data Structures Implementation
1. Product Carousel (Doubly Linked List)
public class ProductLists {
    private productNode head, tail;
    // Features: addToFront, addToEnd, moveToFront, maintainFeaturedConstraint
}
Maintains featured product constraint (first 3 positions)

Cycle detection and repair using Floyd's algorithm

Efficient rearrangement of products

2. Shopping Cart (Custom Hash Table)
class HashTable {
    private Entry[] entries;
    // Features: put, get, remove, rehashing
}
Dynamic resizing with load factor 0.75

Separate chaining for collision resolution

Efficient O(1) average case operations

3. Customer Management (BST with Promotion)
class CustomerBST {
    private CustomerNode root;
    // Features: promoteHotCustomer, find, delete
}
Promotion heuristic for frequent buyers

Balancing through rotation for hot customers

Efficient search O(log n) average case

4. Order Processing (Priority Queue)
class OrderQueue {
    private Node front, rear;
    // VIP orders get priority positioning
}
VIP customers can jump ahead by one position

Fair queueing for regular orders

Efficient enqueue/dequeue operations

5. Recommendation System (Graph)
class RecommendationGraph {
    private Map<String, Set<String>> adjacencyList;
    // Product relationship mapping
}
Undirected graph for product associations

K-recommendations based on connected products

🎯 Key Features
🔄 Product Management
Add/Remove products from carousel

Featured product constraint enforcement

Move products to front for prominence

Cycle detection and repair in product list

🛒 Shopping Cart Operations
Add/Remove/Update product quantities

Undo functionality for last action

Persistent cart state across sessions

Efficient item lookup using hash table

📦 Order Processing
VIP priority system with limited jumping

Order queue management

Batch order processing

Order history tracking

👥 Customer Management
Customer profile storage in BST

Purchase count tracking

Hot customer promotion algorithm

Efficient customer lookup and management

🤖 Smart Recommendations
Product relationship graph

Personalized recommendations

Configurable recommendation count

Cross-selling opportunities

🚀 Getting Started
Prerequisites
Java JDK 8 or higher

Any Java IDE or command line

Installation & Execution
1)Compile all Java files:
javac *.java
2)Run the main application:
java Main
3)Follow the interactive menu to explore different features
💡 Usage Examples
Adding a Product to Cart
1. Select "Manage Shopping Cart"
2. Choose "Add Product"
3. Enter Product ID and Quantity
4. System validates stock and updates cart

Processing VIP Order
1. Add items to cart
2. Place order with VIP flag
3. System prioritizes VIP in queue
4. Process orders from queue

Customer Promotion
1. Customer makes multiple purchases
2. System tracks purchase count
3. Admin can promote hot customers
4. BST restructures for faster access

🔧 Technical Highlights

Efficient node allocation in linked structures

Automatic garbage collection for removed elements

Error Handling
Cycle detection in product carousel

Null checks for all operations

Empty collection validations

Stock validation during cart operations

📈 Business Logic
Featured Products Algorithm
Ensures first 3 products in carousel are featured

Automatically rearranges when constraint is violated

Maintains product visibility for promotions

VIP Order Processing
VIP orders can jump ahead by one position

Prevents complete queue bypass for fairness

Maintains order processing efficiency

Customer Promotion Strategy
Frequent buyers are promoted closer to root in BST

Improves access time for valuable customers

Implements self-adjusting tree structure

🔮 Extension Possibilities
Potential Enhancements
Database integration for persistent storage

REST API for frontend communication

Machine learning for better recommendations

Payment gateway integration

Inventory forecasting algorithms

Multi-vendor support

Scalability Improvements
Concurrent data structures for multi-threading

Caching layer for frequent queries

Distributed system architecture

Microservices decomposition

🐛 Debugging Features
Built-in Diagnostics
Cycle detection in linked lists

Tree traversal displays

Graph visualization

Stack trace for undo operations

Queue status monitoring

📚 Learning Outcomes
This project demonstrates:

Practical implementation of data structures

Algorithm design for real-world problems

System architecture planning

Trade-off analysis between different approaches

Problem-solving with computational thinking
