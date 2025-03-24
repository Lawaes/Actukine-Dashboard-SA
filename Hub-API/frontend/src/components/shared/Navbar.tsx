"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { authState, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { name: 'Tableau de bord', href: '/dashboard', showFor: ['all'] },
      { name: 'Publications', href: '/posts', showFor: ['all'] },
      { name: 'Mes tâches', href: '/tasks', showFor: ['all'] },
    ];

    // Si l'utilisateur est admin, ajouter des liens administratifs
    if (authState.user?.role === 'admin') {
      links.push(
        { name: 'Administration', href: '/admin', showFor: ['admin'] },
        { name: 'Utilisateurs', href: '/admin/users', showFor: ['admin'] }
      );
    }

    return links.filter(
      link => link.showFor.includes('all') || (authState.user?.role && link.showFor.includes(authState.user.role))
    );
  };

  // Vérifier si le lien est actif (pour le style)
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="text-white font-bold text-xl">
                Hub Social
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {authState.isAuthenticated && getNavLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(link.href)
                        ? 'bg-primary-700 text-white'
                        : 'text-white hover:bg-primary-500'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {authState.isAuthenticated ? (
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="text-white mr-4">Bonjour, {authState.user?.username}</span>
                    <button
                      onClick={() => logout()}
                      className="bg-primary-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-800"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    href="/login"
                    className="bg-primary-700 px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-primary-800"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="bg-white px-3 py-2 rounded-md text-sm font-medium text-primary-600 hover:bg-gray-100"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-primary-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isMenuOpen ? (
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
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
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
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authState.isAuthenticated && getNavLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.href)
                    ? 'bg-primary-700 text-white'
                    : 'text-white hover:bg-primary-500'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-primary-700">
            {authState.isAuthenticated ? (
              <div className="px-2 space-y-1">
                <div className="flex items-center px-3">
                  <span className="text-white block mb-2">Bonjour, {authState.user?.username}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-primary-700 hover:bg-primary-800"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-700 hover:bg-primary-800"
                  onClick={closeMenu}
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary-700 bg-white hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 