import { useState} from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/config'

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e)=>{
    e.preventDefault();
    setError("");
    setLoading(true)

    try{
        await createUserWithEmailAndPassword(auth,email,password);
        console.log("Account created successfully!");
    }catch(err){
        setError(err.message);
    }finally{
        setLoading(false)
    }

  };
  return(
    <div className="bg-gray-50 flex items-center justify-center min-h-screen px-4">
        <div className='w-full max-w-md bg-white rounded-xl shadow-md p-8'>
            <h2 className='text-2xl font-bold text-gray-900 text-center mb-6'>
                Create an Account
            </h2>
            {error &&(
                <div className='bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4'>
                    {error}
                 </div>   
            )}
            <form onSubmit={handleSignUp} className='space-y-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email Address
                    </label>
                    <input
                    type="email"
                    required
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    placeholder='you@example.com'
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                    />
                </div>
                 <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <button
          type="submit"
          disabled={loading}
          className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition duration-200'>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
            </form>

        </div>
    </div>
  )
}