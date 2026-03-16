import { useState, useRef } from 'react';
import RadialLensChart from './RadialLensChart';

interface LensOverlayProps {
  x: number;
  y: number;
  r: number;
  stats: any[];
  categories: string[];
  onLensDrag: (x: number, y: number) => void;
}

export default function LensOverlay({ x, y, r, stats, onLensDrag }: LensOverlayProps) {
  const [isDragging, setIsDragging] = useState(false);
  const pointerOffset = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    pointerOffset.current = {
      x: e.clientX - x,
      y: e.clientY - y
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      e.stopPropagation();
      onLensDrag(e.clientX - pointerOffset.current.x, e.clientY - pointerOffset.current.y);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const chartR = Math.max(r, 80);
  const totalItems = stats.reduce((sum, s) => sum + s.groups.filter((g: any) => g.count > 0).length, 0);
  const totalCategories = stats.length;
  
  const r_year = chartR + 90;
  let spreadPerItem = (40 / r_year) * (180 / Math.PI); 
  
  const r_title = chartR + 24;
  let categoryPadding = totalCategories === 2 ? 140 : (80 / r_title) * (180 / Math.PI);

  const unconstrainedTotal = Math.max(0, totalItems - totalCategories) * spreadPerItem + Math.max(0, totalCategories - 1) * categoryPadding;
  
  if (unconstrainedTotal > 320) {
    const scale = 320 / unconstrainedTotal;
    spreadPerItem *= scale;
    categoryPadding *= scale;
  }

  const categorySpreads = stats.map(s => {
    const numGroups = s.groups.filter((g: any) => g.count > 0).length;
    return Math.max(0, (numGroups - 1) * spreadPerItem);
  });

  const totalAngle = categorySpreads.reduce((sum, s) => sum + s, 0) + Math.max(0, stats.length - 1) * categoryPadding;
  
  let currAngle = -totalAngle / 2;
  const angles = stats.map((_, i) => {
    const startAngle = currAngle;
    const endAngle = currAngle + categorySpreads[i];
    currAngle += categorySpreads[i] + categoryPadding;
    return { startAngle, endAngle };
  });

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      <div 
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'absolute',
          top: y - r,
          left: x - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          border: '4px dashed rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 0 4000px rgba(0,0,0,0.4)',
          pointerEvents: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none'
        }} 
      />

      {stats.map((stat, i) => {
        return (
          <RadialLensChart 
            key={stat.category}
            x={x} 
            y={y} 
            r={r} 
            categoryStats={stat} 
            startAngle={angles[i].startAngle}
            endAngle={angles[i].endAngle}
          />
        );
      })}
    </div>
  );
}
