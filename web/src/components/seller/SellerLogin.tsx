import { useEffect, useState} from 'react'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast';

interface SellerLoginCredentials {
  email: string;
  password: string;
}

interface SellerLoginResponse {
  success: boolean;
  message?: string;
}

interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

function SellerLogin() {
    const { isSeller, setIsSeller, navigate, axios} = useAppContext();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
          e.preventDefault();
          const { data } = await axios.post<SellerLoginResponse>('/api/seller/login', {email, password} as SellerLoginCredentials);
          if(data.success){
            setIsSeller(true);
            navigate('/seller');
          }
          else{
            toast.error(data.message ?? "Something went wrong");
          }
        } catch (error) {
          toast.error((error as ErrorResponse).response?.data?.message ?? "Something went wrong");
        }
    }

    useEffect(() => {
        if(isSeller){
            navigate("/seller");
        }
    }, [isSeller, navigate]);

  return !isSeller && (
    <form onSubmit={onSubmitHandler} className='min-h-screen flex items-center text-sm text-gray-600'>
      <div className='flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200'>
        <p className='text-2xl font-medium m-auto'>
            <span className='text-primary-dull'>
                Seller {" "}
            </span>
            Login
        </p>
        <div className='w-full'>
            <p>Email:</p>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
                type='email' placeholder='Enter Email' required className='border border-gray-200 
                rounded w-full p-2 mt-1 outline-primary' />
        </div>
        <div className='w-full'>
            <p>Password:</p>
            <input onChange={(e) => setPassword(e.target.value)} value={password} 
                type='password' placeholder='Enter Password' required className='border border-gray-200 
                rounded w-full p-2 mt-1 outline-primary' />
        </div>
        <button className='bg-primary-dull text-white w-full py-2 rounded-md cursor-pointer'>Login</button>
      </div>
    </form>
  )
}

export default SellerLogin