import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import {
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router'
import Login from './components/login'
import SignUp from './components/signup'
import Dashboard from './components/dashboard'
import './App.css'

function LoadingScreen() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-gray-600 font-medium'>Loading...</div>
    </div>
  )
}

function ProtectedRoute({ user }) {
  const location = useLocation()

  return user
    ? <Outlet />
    : <Navigate to='/login' replace state={{ from: location }} />
}

function PublicOnlyRoute({ user }) {
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/dashboard'

  return user
    ? <Navigate to={destination} replace />
    : <Outlet />
}

function AuthenticationPage() {
  const { pathname } = useLocation()
  const showSignUp = pathname === '/signup'

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center'>
      {showSignUp ? <SignUp /> : <Login />}
      <div className='text-center pb-8 -mt-8'>
        <p className='text-sm text-gray-600'>
          {showSignUp ? "Already have an account? " : "Don't have an account? "}
          <Link
            to={showSignUp ? '/login' : '/signup'}
            className='text-blue-600 hover:underline font-medium'
          >
            {showSignUp ? 'Log in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
      setAuthError('')
    }, (error) => {
      setAuthError(error.message || 'Unable to check your sign-in status.')
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return <LoadingScreen />
  }

  if (authError) {
    return (
      <main className='min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center'>
        <p className='text-red-700' role='alert'>{authError}</p>
        <button
          className='rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700'
          onClick={() => window.location.reload()}
          type='button'
        >
          Try again
        </button>
      </main>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<Navigate to='/login' replace />} />
      <Route element={<PublicOnlyRoute user={user} />}>
        <Route path='/login' element={<AuthenticationPage />} />
        <Route path='/signup' element={<AuthenticationPage />} />
      </Route>
      <Route element={<ProtectedRoute user={user} />}>
        <Route path='/dashboard' element={<Dashboard user={user} />} />
      </Route>
      <Route
        path='*'
        element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
