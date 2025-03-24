import { notFound } from 'next/navigation';
import PostForm from '@/components/posts/PostForm';
import { postService } from '@/lib/api';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function EditPostPage({ params }: PageProps) {
  const postId = parseInt(params.id, 10);
  
  if (isNaN(postId)) {
    return notFound();
  }
  
  try {
    const post = await postService.getPost(postId);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Modifier la publication</h1>
        <PostForm initialData={post.data} isEditing={true} postId={postId} />
      </div>
    );
  } catch (error) {
    // Si le post n'existe pas ou autre erreur
    return notFound();
  }
} 