import { AlertCircle, Lightbulb, Droplets, Trash2, Loader as Road, Trees as Tree, Shield, Coffee } from 'lucide-react';

type Category = 
  | 'pothole' 
  | 'street-light' 
  | 'water-leak' 
  | 'garbage' 
  | 'sidewalk' 
  | 'park' 
  | 'safety' 
  | 'other';

interface CategoryConfig {
  icon: React.ReactNode;
  label: string;
  bgColor: string;
  textColor: string;
}

const categoryConfig: Record<Category, CategoryConfig> = {
  'pothole': {
    icon: <Road size={14} />,
    label: 'Pothole',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    textColor: 'text-orange-800 dark:text-orange-200'
  },
  'street-light': {
    icon: <Lightbulb size={14} />,
    label: 'Street Light',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  },
  'water-leak': {
    icon: <Droplets size={14} />,
    label: 'Water Leak',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-200'
  },
  'garbage': {
    icon: <Trash2 size={14} />,
    label: 'Garbage',
    bgColor: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-200'
  },
  'sidewalk': {
    icon: <Road size={14} />,
    label: 'Sidewalk',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-800 dark:text-gray-200'
  },
  'park': {
    icon: <Tree size={14} />,
    label: 'Park',
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-200'
  },
  'safety': {
    icon: <Shield size={14} />,
    label: 'Safety',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-800 dark:text-purple-200'
  },
  'other': {
    icon: <Coffee size={14} />,
    label: 'Other',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    textColor: 'text-gray-800 dark:text-gray-200'
  }
};

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  size = 'sm' 
}) => {
  const config = categoryConfig[category] || categoryConfig.other;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1'
  };
  
  return (
    <span className={`
      inline-flex items-center rounded-full
      ${config.bgColor} ${config.textColor} ${sizeClasses[size]}
      font-medium
    `}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};