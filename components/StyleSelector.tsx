'use client';

import React from 'react';
import styles, { stylesByCategory } from '@/lib/styles';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '@/components/ui/select';

interface StyleSelectorProps {
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export function StyleSelector({ selectedStyle, onStyleChange }: StyleSelectorProps) {
  const categories = Object.keys(stylesByCategory);
  
  // Get emoji for specific style
  const getStyleIcon = (styleValue: string) => {
    switch(styleValue) {
      // Photographic styles
      case 'photorealistic': return <span className="mr-2">📷</span>;
      case 'cinematic': return <span className="mr-2">🎬</span>;
      
      // Illustration styles
      case 'anime': return <span className="mr-2">🎭</span>;
      case 'comic book': return <span className="mr-2">💬</span>;
      case 'studio ghibli': return <span className="mr-2">🌱</span>;
      
      // Digital styles
      case 'digital art': return <span className="mr-2">💻</span>;
      case 'pixel art': return <span className="mr-2">👾</span>;
      case 'cyberpunk': return <span className="mr-2">🤖</span>;
      case '3D rendering': return <span className="mr-2">🧊</span>;
      case 'vaporwave': return <span className="mr-2">💎</span>;
      case 'isometric': return <span className="mr-2">📐</span>;
      
      // Traditional styles
      case 'oil painting': return <span className="mr-2">🎨</span>;
      case 'watercolor': return <span className="mr-2">💧</span>;
      case 'sketch': return <span className="mr-2">✏️</span>;
      case 'impressionist': return <span className="mr-2">🖌️</span>;
      
      // Artistic styles
      case 'steampunk': return <span className="mr-2">⚙️</span>;
      case 'fantasy': return <span className="mr-2">🏔️</span>;
      case 'abstract': return <span className="mr-2">🔳</span>;
      case 'pop art': return <span className="mr-2">🎭</span>;
      case 'minimalist': return <span className="mr-2">⬜</span>;
      
      // None
      case 'none': return <span className="mr-2">❌</span>;
      
      default: return <span className="mr-2">✨</span>;
    }
  };
  
  // No icons for category headers
  
  // Custom render for the selected value
  const renderSelectedValue = () => {
    if (selectedStyle === 'none') {
      return (
        <div className="flex items-center">
          {getStyleIcon('none')}
          <span>No style</span>
        </div>
      );
    }
    
    const selectedStyleObj = styles.find(style => style.value === selectedStyle);
    if (!selectedStyleObj) return <span>Select a style</span>;
    
    return (
      <div className="flex items-center">
        {getStyleIcon(selectedStyle)}
        <span>{selectedStyleObj.label}</span>
      </div>
    );
  };
  
  return (
    <Select value={selectedStyle} onValueChange={onStyleChange}>
      <SelectTrigger className="w-full">
        {renderSelectedValue()}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none" className="flex items-center">
          {getStyleIcon('none')}
          No style
        </SelectItem>
        {categories.map((category) => (
          <SelectGroup key={category}>
            <SelectLabel className="font-bold">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectLabel>
            {stylesByCategory[category].map((style) => (
              <SelectItem key={style.value} value={style.value} className="flex items-center pl-6">
                {getStyleIcon(style.value)}
                {style.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}