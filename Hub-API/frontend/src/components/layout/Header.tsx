import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { authState, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-primary-600 font-bold text-xl">
                Hub Project
              </Link>
            </div>
            {authState.isAuthenticated && (
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/posts"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/posts')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Publications
                </Link>
                <Link
                  href="/tasks"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/tasks')
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Mes tâches
                </Link>
                {authState.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive('/admin')
                        ? 'border-primary-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Administration
                  </Link>
                )}
              </nav>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {authState.isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    {authState.user?.username}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 text-sm text-white bg-primary-600 border border-primary-600 rounded-md hover:bg-primary-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {authState.isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/dashboard')
                      ? 'border-primary-500 text-primary-700 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/posts"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/posts')
                      ? 'border-primary-500 text-primary-700 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Publications
                </Link>
                <Link
                  href="/tasks"
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    isActive('/tasks')
                      ? 'border-primary-500 text-primary-700 bg-primary-50'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Mes tâches
                </Link>
                {authState.user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive('/admin')
                        ? 'border-primary-500 text-primary-700 bg-primary-50'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    Administration
                  </Link>
                )}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-800 font-medium">
                          {authState.user?.username.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">
                        {authState.user?.username}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {authState.user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 space-y-1">
                <Link
                  href="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 