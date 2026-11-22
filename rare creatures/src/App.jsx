import { useState, useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import Login from './components/login'
import SignUp from './components/signup'
import Dashboard from './components/dashboard'
import './App.css'

function App() {
  const [user, setUser]= useState(null);
  const [loading,setLoading]=useState(true);
  const[showSignUp,setShowSignUp]=useState(false)

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(currentUser)=>{
      setUser(currentUser);
      setLoading(false)
    })
    return()=>unsubscribe();
  },[])
  if (loading){
    return(
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-gray-600 font-medium'>Loading...</div>
      </div>
    )
  }if(user){
    return <Dashboard user={user} />
  }

  return (
    <>
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center'>
      {showSignUp ? <SignUp /> : <Login />}
      <div className='text-center pb-8 -mt-8'>
        <p className='text-sm text-gray-600'>
          {showSignUp ? "Already have an account? " : "Don't have an account? "}
          <button 
          type='button'
          onClick={()=> setShowSignUp(!showSignUp)}
          className='text-blue-600 hover:underline font-medium'>
            {showSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>

    </div>
      
    </>
  )
}

export default App
