import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

interface EditState {
  [productId: string]: {
    value: number | string;
    editing: boolean;
  };
}

function ProductList() {
  const { products, currency, axios: api, fetchProducts } = useAppContext();

  const [editState, setEditState] = useState<EditState>({});

  const handleEdit = (id: string, quantity: number) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        value: quantity,
        editing: true,
      },
    }));
  };

  const handleChange = (id: string, value: string) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        value,
      },
    }));
  };

  const handleCancel = (id: string, quantity: number) => {
    setEditState((prev) => ({
      ...prev,
      [id]: {
        value: quantity,
        editing: false,
      },
    }));
  };

  const handleUpdate = async (id: string) => {
    try {
      const value = editState[id].value;

      const { data } = await api.post("/api/product/stock", {
        id,
        quantity: Number(value),
      });

      if (data.success) {
        toast.success("Quantity updated");

        setEditState((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            editing: false,
          },
        }));

        await fetchProducts();
      } else {
        toast.error(data.message ?? "Failed to update quantity");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>

        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">
                  Product
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Category
                </th>
                <th className="px-4 py-3 font-semibold truncate hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold truncate">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody className="text-sm text-gray-500">
              {products.map((product) => {
                const state = editState[product._id] ?? {
                  value: product.quantity,
                  editing: false,
                };

                return (
                  <tr
                    key={product._id}
                    className="border-t border-gray-500/20"
                  >
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="border border-gray-300 rounded overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16"
                        />
                      </div>

                      <span className="truncate max-sm:hidden w-full">
                        {product.name}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {product.category}
                    </td>

                    <td className="px-4 py-3 max-sm:hidden">
                      {currency}
                      {product.offerPrice}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          value={state.value}
                          aria-label={`Quantity for ${product.name}`}
                          placeholder="Quantity"
                          onFocus={() =>
                            handleEdit(product._id, product.quantity)
                          }
                          onChange={(e) =>
                            handleChange(
                              product._id,
                              e.target.value
                            )
                          }
                          className="w-20 px-2 py-1 border border-gray-400 rounded outline-none text-center"
                        />

                        {state.editing && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleUpdate(product._id)
                              }
                              className="px-3 py-1 bg-primary hover:bg-primary-dull text-white rounded-[5px] cursor-pointer"
                            >
                              Update
                            </button>

                            <button
                              onClick={() =>
                                handleCancel(
                                  product._id,
                                  product.quantity
                                )
                              }
                              className="px-3 py-1 bg-gray-500 text-white rounded-[5px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductList;