export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://hub-project.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/hub-logo.svg"
              alt="Hub Project Logo"
              className="h-8 w-auto"
              width={100}
              height={24}
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center mt-6 mb-2">
          Bienvenue sur Hub Project
        </h1>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
          Votre plateforme de gestion de publications sur les réseaux sociaux
        </p>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Gestion des Publications</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Créez, planifiez et gérez vos publications sur différentes plateformes.
            </p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Collaboration en Équipe</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Travaillez en équipe avec différents rôles et permissions.
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <a
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Commencer
          </a>
        </div>
      </div>
    </main>
  );
} 