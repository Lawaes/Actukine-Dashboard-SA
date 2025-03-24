import PostForm from '@/components/posts/PostForm';

export default function NewPostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle publication</h1>
      <PostForm />
    </div>
  );
} 