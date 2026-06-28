import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCart from "../components/ProductCart";

function AllProducts() {
  const { products, searchQuery } = useAppContext();
  console.log(products);
  const filteredProducts = useMemo(() => {
    if (searchQuery.length > 0) {
      return products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return products;
  }, [products, searchQuery]);

  return (
    <div className="mt-16 flex flex-col">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary-dull rounded-full" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {filteredProducts
          .filter((product) => product.inStock)
          .map((product) => (
            <ProductCart key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
}

export default AllProducts;