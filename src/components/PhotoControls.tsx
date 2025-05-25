
import React from 'react';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface PhotoControlsProps {
  onZoom: (direction: 'in' | 'out') => void;
  onRotation: (direction: 'cw' | 'ccw') => void;
}

const PhotoControls: React.FC<PhotoControlsProps> = ({
  onZoom,
  onRotation
}) => {
  return (
    <div className="flex gap-2 justify-center flex-wrap">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onZoom('out')}
      >
        <ZoomOut className="h-4 w-4 mr-1" />
        Уменьшить
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onZoom('in')}
      >
        <ZoomIn className="h-4 w-4 mr-1" />
        Увеличить
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onRotation('ccw')}
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Влево
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onRotation('cw')}
      >
        <RotateCw className="h-4 w-4 mr-1" />
        Вправо
      </Button>
    </div>
  );
};

export default PhotoControls;
