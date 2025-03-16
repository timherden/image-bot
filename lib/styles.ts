export interface StyleOption {
  value: string;
  label: string;
  description: string;
  category: 'artistic' | 'photographic' | 'digital' | 'illustration' | 'traditional';
}

const styles: StyleOption[] = [
  {
    value: 'photorealistic',
    label: 'Photorealistic',
    description: 'Highly detailed image that looks like a photograph',
    category: 'photographic'
  },
  {
    value: 'cinematic',
    label: 'Cinematic',
    description: 'Movie-like quality with dramatic lighting and composition',
    category: 'photographic'
  },
  {
    value: 'anime',
    label: 'Anime',
    description: 'Japanese animation style with clean lines and expressive features',
    category: 'illustration'
  },
  {
    value: 'digital art',
    label: 'Digital Art',
    description: 'Modern digital painting with vibrant colors',
    category: 'digital'
  },
  {
    value: 'oil painting',
    label: 'Oil Painting',
    description: 'Traditional oil painting technique with rich textures',
    category: 'traditional'
  },
  {
    value: 'watercolor',
    label: 'Watercolor',
    description: 'Soft, transparent watercolor painting style',
    category: 'traditional'
  },
  {
    value: 'pixel art',
    label: 'Pixel Art',
    description: 'Retro video game style with visible pixels',
    category: 'digital'
  },
  {
    value: 'comic book',
    label: 'Comic Book',
    description: 'Bold outlines and vibrant colors like a comic book',
    category: 'illustration'
  },
  {
    value: 'cyberpunk',
    label: 'Cyberpunk',
    description: 'Futuristic dystopian aesthetic with neon lights',
    category: 'digital'
  },
  {
    value: 'steampunk',
    label: 'Steampunk',
    description: 'Victorian-era sci-fi with brass machinery and steam power',
    category: 'artistic'
  },
  {
    value: 'fantasy',
    label: 'Fantasy',
    description: 'Magical and mythical elements in a fantastical setting',
    category: 'artistic'
  },
  {
    value: 'sketch',
    label: 'Sketch',
    description: 'Hand-drawn pencil or ink sketch style',
    category: 'traditional'
  },
  {
    value: '3D rendering',
    label: '3D Rendering',
    description: 'Computer-generated 3D model with realistic lighting',
    category: 'digital'
  },
  {
    value: 'vaporwave',
    label: 'Vaporwave',
    description: 'Retro aesthetic with pink and blue gradients',
    category: 'digital'
  },
  {
    value: 'abstract',
    label: 'Abstract',
    description: 'Non-representational art focusing on colors, shapes, and textures',
    category: 'artistic'
  },
  {
    value: 'impressionist',
    label: 'Impressionist',
    description: 'Loose brushstrokes capturing light and atmosphere',
    category: 'traditional'
  },
  {
    value: 'pop art',
    label: 'Pop Art',
    description: 'Bold colors and popular culture imagery like Warhol',
    category: 'artistic'
  },
  {
    value: 'minimalist',
    label: 'Minimalist',
    description: 'Simple, clean design with minimal elements',
    category: 'artistic'
  },
  {
    value: 'isometric',
    label: 'Isometric',
    description: '3D objects presented in isometric perspective',
    category: 'digital'
  },
  {
    value: 'studio ghibli',
    label: 'Studio Ghibli',
    description: 'Whimsical style inspired by Studio Ghibli animations',
    category: 'illustration'
  }
];

// Group styles by category
export const stylesByCategory = styles.reduce((acc, style) => {
  const category = style.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(style);
  return acc;
}, {} as Record<string, StyleOption[]>);

export default styles;