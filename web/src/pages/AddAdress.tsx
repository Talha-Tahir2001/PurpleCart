import { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import type { CreateAddress } from "../types/Address";

interface InputFieldProps {
  type: React.HTMLInputTypeAttribute;
  placeholder: string;
  name: keyof CreateAddress;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  address: CreateAddress;
}

const InputField = ({
  type,
  placeholder,
  name,
  handleChange,
  address,
}: InputFieldProps) => (
  <input
    className="w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition"
    type={type}
    placeholder={placeholder}
    name={name}
    value={address[name]}
    onChange={handleChange}
    required
  />
);

function AddAddress() {
  const { axios: api, user, navigate } = useAppContext();

  const [address, setAddress] = useState<CreateAddress>({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.name as keyof CreateAddress;

    setAddress((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));
  };

  const onSubmitHandler = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!user) return;

    try {
      const { data } = await api.post("/api/address/add", {
        address: {
          ...address,
          zipcode: Number(address.zipcode),
        },
      });

      if (data.success) {
        toast.success(data.message ?? "Address saved");
        navigate("/cart");
      } else {
        toast.error(data.message ?? "Failed to save address");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="mt-12 pb-12">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping{" "}
        <span className="font-semibold text-primary-dull">
          Address
        </span>
      </p>

      <div className="flex flex-col-reverse md:flex-row justify-between mt-4">
        <div className="flex-1 max-w-md">
          <form
            onSubmit={onSubmitHandler}
            className="space-y-3 mt-6 text-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                placeholder="First Name"
                name="firstName"
                address={address}
                handleChange={handleChange}
              />

              <InputField
                type="text"
                placeholder="Last Name"
                name="lastName"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <InputField
              type="email"
              placeholder="Email"
              name="email"
              address={address}
              handleChange={handleChange}
            />

            <InputField
              type="text"
              placeholder="Street"
              name="street"
              address={address}
              handleChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="text"
                placeholder="City"
                name="city"
                address={address}
                handleChange={handleChange}
              />

              <InputField
                type="text"
                placeholder="State"
                name="state"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                type="number"
                placeholder="Zip Code"
                name="zipcode"
                address={address}
                handleChange={handleChange}
              />

              <InputField
                type="text"
                placeholder="Country"
                name="country"
                address={address}
                handleChange={handleChange}
              />
            </div>

            <InputField
              type="text"
              placeholder="Phone"
              name="phone"
              address={address}
              handleChange={handleChange}
            />

            <button
              type="submit"
              className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer"
            >
              SAVE ADDRESS
            </button>
          </form>
        </div>

        <img
          className="md:mr-16 mb-12 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add Address"
        />
      </div>
    </div>
  );
}

export default AddAddress;