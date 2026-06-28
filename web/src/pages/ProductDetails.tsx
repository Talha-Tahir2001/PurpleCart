import { useState, useMemo, type FC } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import ProductCart from "../components/ProductCart";

const ProductDetails: FC = () => {
  const { products, navigate, currency, addToCart } = useAppContext();

  const { id } = useParams<{ id: string }>();

  const [thumbnailIndex, setThumbnailIndex] = useState<number>(0);

  const product = products.find((item) => item._id === id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const productsCopy = products.filter(
      (item) =>
        item.category === product.category && item._id !== product._id
    );
    return productsCopy.slice(0, 5);
  }, [products, product]);

  const thumbnail = product?.images[thumbnailIndex] ?? null;

  if (!product) {
    return null;
  }

  return (
    <div className="mt-8">
      <p>
        <Link to="/">Home</Link> /
        <Link to="/products"> Products</Link> /
        <Link to={`/products/${product.category.toLowerCase()}`}>
          {" "}
          {product.category}
        </Link>{" "}
        /
        <span className="text-primary-dull"> {product.name}</span>
      </p>

      <div className="mt-4 flex flex-col gap-20 md:flex-row">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images.map((image: string, index: number) => (
              <div
                key={index}
                onClick={() => setThumbnailIndex(index)}
                className="max-w-24 cursor-pointer overflow-hidden rounded border border-gray-500/30"
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="max-w-100 overflow-hidden rounded border border-gray-500/30">
            <img
              src={thumbnail ?? ""}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="w-full text-sm md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>

          <div className="mt-1 flex items-center gap-0.5">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  src={
                    i < 4
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star"
                  className="w-3.5 md:w-4"
                />
              ))}

            <p className="ml-2 text-base">(4)</p>
          </div>

          <div className="mt-6">
            <p className="line-through text-gray-500/70">
              MRP: {currency}
              {product.price}
            </p>

            <p className="text-2xl font-medium">
              MRP: {currency}
              {product.offerPrice}
            </p>

            <span className="text-gray-500/70">
              (inclusive of all taxes)
            </span>
          </div>

          <p className="mt-6 text-base font-medium">
            About Product
          </p>

          <ul className="ml-4 list-disc text-gray-500/70">
            {product.description.map((desc: string, index: number) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-4 text-base">
            <button
              onClick={() => addToCart(product._id)}
              className="w-full cursor-pointer bg-gray-100 py-3.5 font-medium text-gray-800/80 transition hover:bg-gray-200"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToCart(product._id);
                navigate("/cart");
              }}
              className="w-full cursor-pointer bg-primary py-3.5 font-medium text-white transition hover:bg-primary-dull"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12 flex flex-col items-center">
        <div className="flex w-max flex-col items-center">
          <p className="text-3xl font-medium">Related Products</p>

          <div className="mt-2 h-0.5 w-20 rounded-full bg-primary-dull" />
        </div>

        <div className="mt-6 grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {relatedProducts
            .filter((product) => product.inStock)
            .map((product) => (
              <ProductCart
                key={product._id}
                product={product}
              />
            ))}
        </div>

        <button
          onClick={() => {
            navigate("/products");
            scrollTo(0, 0);
          }}
          className="mx-auto my-16 cursor-pointer rounded border px-12 py-2.5 text-primary transition hover:bg-primary/10"
        >
          See more
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;