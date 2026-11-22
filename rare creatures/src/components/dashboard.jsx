import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard({ user }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">MyApp</span>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

    
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            You are signed in with <span className="font-medium text-gray-900">{user?.email}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Account Details
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">User ID:</span> {user?.uid}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">Email Verified:</span>{" "}
                {user?.emailVerified ? (
                  <span className="text-green-600 font-medium">Yes</span>
                ) : (
                  <span className="text-amber-600 font-medium">No</span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Your protected app features, charts, or database items go here.
            </p>
            <button
              onClick={handleLogout}
              className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Sign Out of Session
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
