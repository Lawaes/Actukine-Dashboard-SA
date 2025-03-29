import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PostFormData, User } from '@/types';
import { postService, userService } from '@/lib/api';

interface PostFormProps {
  initialData?: PostFormData;
  isEditing?: boolean;
  postId?: number;
}

const PostForm = ({ initialData, isEditing = false, postId }: PostFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState<PostFormData>(
    initialData || {
      title: '',
      description: '',
      imageUrl: '',
      status: 'brouillon',
      publishDate: '',
      platforms: [],
      postType: '',
      visualResponsibleId: undefined,
      reviewResponsibleId: undefined,
    }
  );
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Plateformes disponibles
  const availablePlatforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube'];
  
  // Types de posts disponibles
  const availablePostTypes = ['Interview', 'Présentation E-learning', 'Présentation Auteur', 'Actualité', 'Article'];

  useEffect(() => {
    // Récupérer la liste des utilisateurs pour les sélecteurs
    const fetchUsers = async () => {
      try {
        const response = await userService.getUsers();
        setUsers(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePlatformChange = (platform: string) => {
    const platforms = formData.platforms || [];
    if (platforms.includes(platform)) {
      setFormData({
        ...formData,
        platforms: platforms.filter((p) => p !== platform),
      });
    } else {
      setFormData({
        ...formData,
        platforms: [...platforms, platform],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEditing && postId) {
        await postService.updatePost(postId, formData);
      } else {
        await postService.createPost(formData);
      }
      setSuccess(true);
      // Rediriger vers la liste des posts après 2 secondes
      setTimeout(() => {
        router.push('/posts');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditing ? 'Modifier la publication' : 'Nouvelle publication'}
        </h3>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700">
              Publication {isEditing ? 'mise à jour' : 'créée'} avec succès ! Redirection...
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              rows={3}
              value={formData.description || ''}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          {/* URL de l'image */}
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              URL de l'image
            </label>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Statut
            </label>
            <select
              id="status"
              name="status"
              value={formData.status || 'brouillon'}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="brouillon">Brouillon</option>
              <option value="planifié">Planifié</option>
              <option value="publié">Publié</option>
            </select>
          </div>
          
          {/* Date de publication */}
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
              Date de publication
            </label>
            <input
              type="datetime-local"
              name="publishDate"
              id="publishDate"
              value={formData.publishDate || ''}
              onChange={handleChange}
              className="mt-1 block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          {/* Plateformes */}
          <div>
            <span className="block text-sm font-medium text-gray-700 mb-2">Plateformes</span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availablePlatforms.map((platform) => (
                <div key={platform} className="flex items-center">
                  <input
                    id={`platform-${platform}`}
                    name={`platform-${platform}`}
                    type="checkbox"
                    checked={(formData.platforms || []).includes(platform)}
                    onChange={() => handlePlatformChange(platform)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`platform-${platform}`} className="ml-2 text-sm text-gray-700">
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Type de post */}
          <div>
            <label htmlFor="postType" className="block text-sm font-medium text-gray-700">
              Type de publication
            </label>
            <select
              id="postType"
              name="postType"
              value={formData.postType || ''}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Sélectionner un type</option>
              {availablePostTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Responsable visuel */}
          <div>
            <label htmlFor="visualResponsibleId" className="block text-sm font-medium text-gray-700">
              Responsable visuel
            </label>
            <select
              id="visualResponsibleId"
              name="visualResponsibleId"
              value={formData.visualResponsibleId || ''}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Sélectionner un responsable</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          {/* Responsable relecture */}
          <div>
            <label htmlFor="reviewResponsibleId" className="block text-sm font-medium text-gray-700">
              Responsable relecture
            </label>
            <select
              id="reviewResponsibleId"
              name="reviewResponsibleId"
              value={formData.reviewResponsibleId || ''}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Sélectionner un responsable</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          {/* Boutons de soumission */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/posts')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {loading
                ? 'Traitement...'
                : isEditing
                ? 'Mettre à jour'
                : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm; 