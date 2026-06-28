import { useState, type FormEvent } from "react";
import { useAppContext } from "../context/AppContext";
import { User, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

type AuthState = "login" | "register";

interface AuthResponse {
  success: boolean;
  message?: string;
}

function Login() {
  const {
    setShowUserLogin,
    axios: api,
    navigate,
    fetchUser,
  } = useAppContext();

  const [state, setState] = useState<AuthState>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await api.post<AuthResponse>(
        `/api/user/${state}`,
        {
          name,
          email,
          password,
        }
      );

      if (data.success) {
        navigate("/");
        await fetchUser();
        setShowUserLogin(false);
      } else {
        toast.error(data.message ?? "Authentication failed");
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
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center bg-black/50 text-sm text-gray-600"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="m-auto flex w-80 flex-col items-start gap-4 rounded-lg border border-gray-200 bg-white p-8 py-12 text-gray-500 shadow-xl sm:w-88"
      >
        <p className="m-auto text-2xl font-medium">
          <span className="text-primary">User </span>
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull"
                size={18}
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Enter Name"
                required
                className="mt-1 w-full rounded border border-gray-200 py-2 pl-10 pr-3 outline-primary focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="relative">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull"
              size={18}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Enter Email"
              required
              className="mt-1 w-full rounded border border-gray-200 py-2 pl-10 pr-3 outline-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-dull"
              size={18}
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Enter Password"
              required
              className="mt-1 w-full rounded border border-gray-200 py-2 pl-10 pr-3 outline-primary focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {state === "register" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setState("login")}
              className="cursor-pointer text-primary-dull"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="cursor-pointer text-primary-dull"
            >
              Click here
            </span>
          </p>
        )}

        <button className="w-full cursor-pointer rounded-md bg-primary py-2 font-bold text-white transition-all hover:bg-primary-dull">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;