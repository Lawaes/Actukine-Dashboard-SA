"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types';

export default function TasksPage() {
  const { authState } = useAuth();
  const [tasks, setTasks] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const fetchTasks = async () => {
      if (!authState.isAuthenticated || !authState.user) {
        return;
      }
      
      try {
        setLoading(true);
        
        // Dans une vraie application, il y aurait un endpoint dédié pour récupérer les tâches
        // Ici, nous simulons en récupérant tous les posts et en filtrant
        const response = await postService.getPosts();
        
        if (response && response.data) {
          const userTasks = response.data.filter(post => 
            (post.visualResponsibleId === authState.user?.id && !post.visualValidated) || 
            (post.reviewResponsibleId === authState.user?.id && !post.reviewValidated)
          );
          
          setTasks(userTasks);
          setError(null);
        }
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des tâches');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [authState.isAuthenticated, authState.user]);

  const filterTasks = (tabType: string) => {
    setActiveTab(tabType);
  };

  const getFilteredTasks = () => {
    if (activeTab === 'all') return tasks;
    if (activeTab === 'visual') return tasks.filter(task => task.visualResponsibleId === authState.user?.id && !task.visualValidated);
    if (activeTab === 'review') return tasks.filter(task => task.reviewResponsibleId === authState.user?.id && !task.reviewValidated);
    return tasks;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleValidateTask = async (postId: number, taskType: 'visual' | 'review') => {
    try {
      await postService.validateTask(postId, taskType);
      
      // Mettre à jour l'état local pour refléter la validation
      setTasks(prevTasks => 
        prevTasks.map(task => {
          if (task.id === postId) {
            if (taskType === 'visual') {
              return { ...task, visualValidated: true };
            } else {
              return { ...task, reviewValidated: true };
            }
          }
          return task;
        })
      );
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la validation de la tâche');
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">Veuillez vous connecter pour voir vos tâches</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes tâches assignées</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Liste de vos tâches en attente</h3>
          
          {/* Onglets de filtrage */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => filterTasks('all')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Toutes les tâches
              </button>
              <button
                onClick={() => filterTasks('visual')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'visual'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Responsable visuel
              </button>
              <button
                onClick={() => filterTasks('review')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'review'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Responsable relecture
              </button>
            </nav>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-4">Chargement de vos tâches...</div>
        ) : getFilteredTasks().length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune tâche en attente.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {getFilteredTasks().map((task) => (
              <li key={task.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-primary-600">
                      <Link href={`/posts/${task.id}`} className="hover:underline">
                        {task.title}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {task.description && task.description.length > 100
                        ? `${task.description.slice(0, 100)}...`
                        : task.description || 'Aucune description'}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {task.platforms && task.platforms.map((platform) => (
                        <span key={platform} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <div className="text-sm text-gray-500">
                      Publication: {task.publishDate ? formatDate(task.publishDate) : 'Non planifiée'}
                    </div>
                    <div className="mt-2 flex space-x-2">
                      <Link 
                        href={`/posts/${task.id}`}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
                      >
                        Voir les détails
                      </Link>
                      
                      {task.visualResponsibleId === authState.user?.id && !task.visualValidated && (
                        <button
                          onClick={() => handleValidateTask(task.id, 'visual')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Valider aspect visuel
                        </button>
                      )}
                      
                      {task.reviewResponsibleId === authState.user?.id && !task.reviewValidated && (
                        <button
                          onClick={() => handleValidateTask(task.id, 'review')}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          Valider relecture
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 