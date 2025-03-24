import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { postService } from '@/lib/api';

interface PostListProps {
  filter?: {
    status?: string;
    platform?: string;
    type?: string;
  };
}

const PostList = ({ filter = {} }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getPosts(filter);
        setPosts(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des publications');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

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

  if (loading) {
    return <div className="text-center py-4">Chargement des publications...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Aucune publication trouvée.</p>
        <Link 
          href="/posts/new" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Créer une publication
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <p className="text-sm font-medium text-primary-600 truncate">{post.title}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Créé le {formatDate(post.createdAt)} par {post.user?.username || 'Utilisateur inconnu'}
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(post.status)}`}>
                      {post.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {post.description && post.description.length > 100
                        ? `${post.description.slice(0, 100)}...`
                        : post.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      {post.publishDate ? `Publication : ${formatDate(post.publishDate)}` : 'Date non définie'}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList; 