

const ProductCard = ({ product, onEdit, onDelete }) => {
  // Get user from localStorage
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {}
  const isAdmin = user && user.role === "admin";

  return (
    <div className="bg-[var(--secondary-color)] text-[var(--text-color)] shadow-md rounded-lg p-4 border border-[var(--primary-color)] hover:shadow-lg transition duration-300">
      {/* Product Image */}
      <div className="w-full h-40 bg-gray-700 rounded-md overflow-hidden mb-3">
        <img
          src={product.image || "https://via.placeholder.com/300?text=No+Image"}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/300?text=No+Image"; }}
        />
      </div>

      {/* Product Details */}
      <h3 className="text-lg font-bold mb-1">{product.name}</h3>
      <p className="text-sm opacity-80">SKU: {product.sku}</p>
      <p className="text-sm opacity-80">Category: {product.category}</p>
      <p className="text-md font-semibold mt-2">Price: ${product.price}</p>

      {/* Stock Badge */}
      <span
        className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded ${
          product.stock <= 5
            ? "bg-red-600 text-white"
            : "bg-green-600 text-white"
        }`}
      >
        Stock: {product.stock}
      </span>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-4">
        {/* <button
          onClick={onView}
          className="px-2 py-1 text-xs bg-blue-600 rounded hover:bg-blue-700"
        >
          View
        </button> */}
        {isAdmin && (
          <>
            <button
              onClick={onEdit}
              className="px-2 py-1 text-xs bg-yellow-500 text-black rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-2 py-1 text-xs bg-red-600 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
