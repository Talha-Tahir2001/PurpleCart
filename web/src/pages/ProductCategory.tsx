import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCart from "../components/ProductCart";

function ProductCategory() {
  const { products } = useAppContext();

  const { category } = useParams<{ category: string }>();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === category
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 rounded-full bg-primary" />
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {filteredProducts.map((product) => (
            <ProductCart
              key={product._id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-2xl font-medium text-primary-dull">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductCategory;