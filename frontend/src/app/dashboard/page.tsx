"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/lib/api';
import { Post } from '@/types';

export default function DashboardPage() {
  // Nous utiliserons useEffect côté client pour charger les données
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Carte des statistiques - Publications totales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total des publications</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {/* Composant côté client pour charger les données */}
                      <StatsCounter endpoint="total" />
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/posts" className="font-medium text-primary-600 hover:text-primary-500">
                Voir toutes les publications
              </Link>
            </div>
          </div>
        </div>

        {/* Carte des statistiques - Publications en brouillon */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Brouillons</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      <StatsCounter endpoint="brouillon" />
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/posts?status=brouillon" className="font-medium text-primary-600 hover:text-primary-500">
                Voir les brouillons
              </Link>
            </div>
          </div>
        </div>

        {/* Carte des statistiques - Publications planifiées */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Publications planifiées</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      <StatsCounter endpoint="planifié" />
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/posts?status=planifié" className="font-medium text-primary-600 hover:text-primary-500">
                Voir les publications planifiées
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Publications récentes */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Publications récentes</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <RecentPosts />
        </div>
      </div>

      {/* Calendrier des publications à venir */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Calendrier de publication</h2>
        <div className="bg-white p-6 shadow overflow-hidden sm:rounded-lg">
          <div className="border-b border-gray-200 pb-5 mb-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Publications à venir</h3>
          </div>
          <UpcomingPosts />
        </div>
      </div>
    </div>
  );
}

// Composant côté client pour afficher le nombre de publications
function StatsCounter({ endpoint }: { endpoint: string }) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchCount() {
      try {
        let filters = {};
        if (endpoint !== 'total') {
          filters = { status: endpoint };
        }
        
        const response = await postService.getPosts(filters);
        
        if (response && response.data) {
          setCount(response.data.length);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCount();
  }, [endpoint]);

  if (loading) {
    return <span>Chargement...</span>;
  }

  return <span>{count}</span>;
}

// Composant côté client pour afficher les publications récentes
function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        const response = await postService.getPosts();
        
        if (response && response.data) {
          // Trier par date de création décroissante et prendre les 5 premières
          const sortedPosts = [...response.data].sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5);
          
          setPosts(sortedPosts);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des publications récentes');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement des publications récentes...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-center py-4">Aucune publication récente.</div>;
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'brouillon':
        return 'bg-gray-100 text-gray-800';
      case 'planifié':
        return 'bg-yellow-100 text-yellow-800';
      case 'publié':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <ul className="divide-y divide-gray-200">
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/posts/${post.id}`} className="block hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-primary-600 truncate">{post.title}</p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(post.status)}`}>
                    {post.status}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {post.description && post.description.length > 50
                      ? `${post.description.slice(0, 50)}...`
                      : post.description || 'Aucune description'}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span>Créé le {formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Composant côté client pour afficher les publications à venir
function UpcomingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUpcomingPosts() {
      try {
        const response = await postService.getPosts({ status: 'planifié' });
        
        if (response && response.data) {
          // Filtrer pour ne garder que les publications futures et trier par date de publication
          const now = new Date();
          const upcomingPosts = response.data
            .filter(post => post.publishDate && new Date(post.publishDate) > now)
            .sort((a, b) => {
              if (!a.publishDate || !b.publishDate) return 0;
              return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
            })
            .slice(0, 5); // Limiter à 5 publications
          
          setPosts(upcomingPosts);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des publications à venir');
      } finally {
        setLoading(false);
      }
    }

    fetchUpcomingPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Chargement du calendrier...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return <div className="text-center py-4">Aucune publication planifiée à venir.</div>;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <div key={post.id} className="border-l-4 border-primary-400 pl-4 py-2">
          <div className="flex justify-between items-center">
            <Link href={`/posts/${post.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
              {post.title}
            </Link>
            <span className="text-sm text-gray-500">{formatDate(post.publishDate || '')}</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {post.platforms && post.platforms.length > 0 ? (
              <span className="flex flex-wrap gap-1 mt-1">
                {post.platforms.map((platform) => (
                  <span key={platform} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {platform}
                  </span>
                ))}
              </span>
            ) : (
              'Aucune plateforme'
            )}
          </p>
        </div>
      ))}
    </div>
  );
} 