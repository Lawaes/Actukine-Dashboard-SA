# Hub Project - Guide de style

## Palette de couleurs

### Couleurs principales
- **Bleu primaire**: `#0284c7` (primary-600)
  - Utilisée pour les boutons d'action principale, liens, éléments mis en avant
- **Blanc**: `#ffffff`
  - Fond d'écran principal, textes sur fond sombre
- **Noir**: `#111111`
  - Textes sur fond clair, éléments d'accent

### Nuances de bleu
```tailwind
primary-50: '#f0f9ff'  // Arrière-plans très clairs
primary-100: '#e0f2fe' // Arrière-plans clairs, bordures
primary-200: '#bae6fd' // Éléments désactivés, bordures
primary-300: '#7dd3fc' // Éléments secondaires
primary-400: '#38bdf8' // Éléments interactifs secondaires
primary-500: '#0ea5e9' // Éléments interactifs
primary-600: '#0284c7' // Boutons principaux, accents
primary-700: '#0369a1' // Boutons au survol, éléments actifs
primary-800: '#075985' // Éléments en focus profond
primary-900: '#0c4a6e' // Texte sur fond clair
```

### Couleurs sémantiques
- **Succès**: `#10b981` (vert)
- **Avertissement**: `#f59e0b` (orange)
- **Erreur**: `#ef4444` (rouge)
- **Information**: `#3b82f6` (bleu)

## Typographie

### Familles de polices
- **Titre principal**: Inter (sans-serif)
- **Corps de texte**: Inter (sans-serif)
- **Code**: Monospace

### Tailles
- **Très grand titre**: 2.5rem (40px) - `text-4xl`
- **Grand titre**: 1.875rem (30px) - `text-3xl`
- **Titre moyen**: 1.5rem (24px) - `text-2xl`
- **Petit titre**: 1.25rem (20px) - `text-xl`
- **Corps de texte**: 1rem (16px) - `text-base`
- **Petit texte**: 0.875rem (14px) - `text-sm`
- **Très petit texte**: 0.75rem (12px) - `text-xs`

### Poids
- **Normal**: 400
- **Semi-gras**: 500
- **Gras**: 700

## Composants UI

### Boutons

#### Bouton primaire
```html
<button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Bouton principal
</button>
```

#### Bouton secondaire
```html
<button className="px-4 py-2 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-md border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
  Bouton secondaire
</button>
```

#### Bouton tertiaire (texte)
```html
<button className="text-primary-600 hover:text-primary-700 font-medium">
  Bouton texte
</button>
```

### Cartes et panneaux

#### Carte standard
```html
<div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
  Contenu de la carte
</div>
```

#### Panneau d'information
```html
<div className="bg-primary-50 border-l-4 border-primary-400 p-4">
  <div className="flex">
    <div className="flex-shrink-0">
      <InformationCircleIcon className="h-5 w-5 text-primary-400" />
    </div>
    <div className="ml-3">
      <p className="text-sm text-primary-800">
        Texte d'information
      </p>
    </div>
  </div>
</div>
```

### Formulaires

#### Champ de saisie
```html
<div>
  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
    Email
  </label>
  <div className="mt-1">
    <input
      type="email"
      name="email"
      id="email"
      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
      placeholder="vous@exemple.com"
    />
  </div>
</div>
```

#### Sélecteur
```html
<div>
  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
    Statut
  </label>
  <select
    id="status"
    name="status"
    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
  >
    <option value="brouillon">Brouillon</option>
    <option value="planifié">Planifié</option>
    <option value="publié">Publié</option>
  </select>
</div>
```

## Layout

### Espacement
- **Très petit**: 0.25rem (4px) - `p-1`, `m-1`
- **Petit**: 0.5rem (8px) - `p-2`, `m-2`
- **Moyen**: 1rem (16px) - `p-4`, `m-4`
- **Grand**: 1.5rem (24px) - `p-6`, `m-6`
- **Très grand**: 2rem (32px) - `p-8`, `m-8`

### Structure de page
- **Header**: Navigation principale, logo, profil utilisateur
- **Sidebar**: Navigation secondaire, filtres
- **Main content**: Contenu principal
- **Footer**: Liens utiles, informations légales, copyright

## Icônes
Utilisation de la bibliothèque Heroicons pour la cohérence visuelle.

## Animation et transition
- Transitions douces pour les survols et interactions: `transition duration-200`
- Animations subtiles pour les chargements et actions: `animate-pulse`, `animate-spin`

## Responsive design
- Mobile first
- Points de rupture:
  - **sm**: 640px
  - **md**: 768px
  - **lg**: 1024px
  - **xl**: 1280px
  - **2xl**: 1536px 