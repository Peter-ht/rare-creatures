import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { Link } from 'react-router'
import { auth } from '../firebase/config'

export default function Dashboard({ user }) {
  const [logoutError, setLogoutError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLogoutError('')
    setLoggingOut(true)

    try {
      await signOut(auth)
    } catch (error) {
      setLogoutError(error.message || 'Unable to sign out. Please try again.')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className='min-h-screen bg-stone-50'>
      <header className='border-b border-stone-200 bg-white'>
        <nav
          aria-label='Main navigation'
          className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8'
        >
          <Link className='flex items-center gap-2 font-extrabold tracking-tight text-emerald-900' to='/dashboard'>
            <span aria-hidden='true' className='text-2xl'>🌿</span>
            <span>Rare Creatures</span>
          </Link>
          <div className='flex items-center gap-3'>
            <span className='hidden max-w-64 truncate text-sm text-stone-600 sm:inline' title={user?.email}>
              {user?.email}
            </span>
            <button
              className='rounded-lg border border-stone-300 px-3.5 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 disabled:cursor-wait disabled:opacity-60'
              disabled={loggingOut}
              onClick={handleLogout}
              type='button'
            >
              {loggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </nav>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {logoutError && (
          <p className='mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800' role='alert'>
            {logoutError}
          </p>
        )}
      </main>
    </div>
  )
}
