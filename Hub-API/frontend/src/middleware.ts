import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes qui ne nécessitent pas d'authentification
const publicRoutes = ['/login', '/register', '/forgot-password'];

// Routes qui nécessitent un rôle admin
const adminRoutes = ['/admin', '/admin/users', '/admin/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('authToken')?.value;
  
  // Vérifier si l'utilisateur essaie d'accéder à une route protégée sans être authentifié
  if (!token && !publicRoutes.some(route => pathname.startsWith(route)) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    // Rediriger vers la page de connexion
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Si l'utilisateur est déjà connecté et essaie d'accéder à une page publique comme login
  if (token && publicRoutes.some(route => pathname === route)) {
    // Rediriger vers le tableau de bord
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Pour les routes admin, vérifier le rôle de l'utilisateur (à implémenter quand la API sera prête)
  // Si vous avez un moyen de vérifier le rôle depuis le token, vous pouvez le faire ici
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclure les fichiers statiques et les API routes
    '/((?!_next/static|_next/image|favicon.ico|images|api).*)',
  ],
}; 