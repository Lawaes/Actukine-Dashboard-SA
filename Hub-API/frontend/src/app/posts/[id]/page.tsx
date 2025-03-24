import { notFound } from 'next/navigation';
import Link from 'next/link';
import { postService, userService } from '@/lib/api';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PostDetailPage({ params }: PageProps) {
  const postId = parseInt(params.id, 10);
  
  if (isNaN(postId)) {
    return notFound();
  }
  
  try {
    const post = await postService.getPost(postId);
    const postData = post.data;
    
    // Récupérer les informations des responsables si ils existent
    let visualResponsible = null;
    let reviewResponsible = null;
    
    if (postData.visualResponsibleId) {
      const visualResp = await userService.getUser(postData.visualResponsibleId);
      visualResponsible = visualResp.data;
    }
    
    if (postData.reviewResponsibleId) {
      const reviewResp = await userService.getUser(postData.reviewResponsibleId);
      reviewResponsible = reviewResp.data;
    }
    
    // Formater la date de publication si elle existe
    const formatDate = (dateString) => {
      if (!dateString) return 'Non définie';
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };
    
    // Obtenir la classe CSS en fonction du statut
    const getStatusClass = (status) => {
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
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{postData.title}</h1>
          <div className="flex space-x-3">
            <Link 
              href={`/posts/${postId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Modifier
            </Link>
            <Link 
              href="/posts"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Retour à la liste
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Détails de la publication</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Informations complètes</p>
            </div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(postData.status)}`}>
              {postData.status}
            </span>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Titre</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{postData.title}</dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{postData.description || 'Aucune description'}</dd>
              </div>
              
              {postData.imageUrl && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Image</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <img src={postData.imageUrl} alt={postData.title} className="max-w-lg rounded-lg" />
                  </dd>
                </div>
              )}
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(postData.createdAt)}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Date de publication</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(postData.publishDate)}</dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Type de publication</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{postData.postType || 'Non défini'}</dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Plateformes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {postData.platforms && postData.platforms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {postData.platforms.map((platform) => (
                        <span key={platform} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {platform}
                        </span>
                      ))}
                    </div>
                  ) : (
                    'Aucune plateforme sélectionnée'
                  )}
                </dd>
              </div>
              
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Responsable visuel</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {visualResponsible ? visualResponsible.username : 'Non assigné'}
                </dd>
              </div>
              
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Responsable relecture</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {reviewResponsible ? reviewResponsible.username : 'Non assigné'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return notFound();
  }
} 