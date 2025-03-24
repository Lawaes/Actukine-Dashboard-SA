import Link from 'next/link';
import PostList from '@/components/posts/PostList';

export default function PostsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link
          href="/posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          Nouvelle publication
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Liste des publications</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Gérez toutes vos publications sur les réseaux sociaux
          </p>
        </div>
        <div className="border-t border-gray-200">
          <PostList />
        </div>
      </div>
    </div>
  );
} 