import { CATEGORY_COLORS } from '../utils/sampleData';

interface RadialLensChartProps {
  x: number;
  y: number;
  r: number;
  categoryStats: any;
  startAngle: number;
  endAngle: number;
}

export default function RadialLensChart({ x, y, r, categoryStats, startAngle, endAngle }: RadialLensChartProps) {
  if (!categoryStats || categoryStats.groups.length === 0) return null;

  const color = CATEGORY_COLORS[categoryStats.category] || '#332734'; 
  const cleanCat = categoryStats.category.replace(/\s+/g, '-').toLowerCase();
  
  const maxCount = Math.max(...categoryStats.groups.map((g: any) => g.count));
  const maxLineLength = 120;
  
  const groupsToDraw = categoryStats.groups.filter((g: any) => g.count > 0);
  const n = groupsToDraw.length;

  if (n === 0) return null;

  const midAngle = (startAngle + endAngle) / 2;
  
  const chartR = Math.max(r, 80);
  
  const R_TITLE = chartR + 24;
  const R_ARC = chartR + 64;
  const R_YEAR = chartR + 90;
  const R_BAR_START = chartR + 124;

  const textLengthApprox = categoryStats.category.length * 9.5 + 24;
  const textAngleApprox = (textLengthApprox / (Math.PI * R_TITLE)) * 180;

  return (
    <svg 
      style={{ 
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
        overflow: 'visible', pointerEvents: 'none', transition: 'all 0.1s' 
      }}
    >
      <defs>
        <filter id={`dropshadow-${cleanCat}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
        </filter>
        
        <path 
          id={`textpath-${cleanCat}`} 
          d={describeTopArc(x, y, R_TITLE, -90, 90)} 
        />
      </defs>

      <g transform={`rotate(${midAngle}, ${x}, ${y})`}>
        <path 
          d={describeTopArc(x, y, R_TITLE, -textAngleApprox/2, textAngleApprox/2)} 
          fill="transparent" 
          stroke={color} 
          strokeWidth={28}
          strokeLinecap="round"
        />
        <text 
          fontSize="14" 
          fontWeight="900" 
          fontFamily="'Metrophobic', sans-serif"
          fill="#000"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          <textPath href={`#textpath-${cleanCat}`} startOffset="50%" textAnchor="middle" dominantBaseline="central">
            {categoryStats.category}
          </textPath>
        </text>
      </g>

      {n > 1 && (
        <path 
          d={describeTopArc(x, y, R_ARC, startAngle, endAngle)} 
          fill="none" 
          stroke={color} 
          strokeWidth={10}
          strokeLinecap="round"
          filter={`url(#dropshadow-${cleanCat})`}
        />
      )}

      {groupsToDraw.map((g: any, i: number) => {
        const angle = n > 1 ? startAngle + i * ((endAngle - startAngle) / (n - 1)) : startAngle;
        const barHeight = Math.max(16, (g.count / maxCount) * maxLineLength);
        
        return (
          <g key={g.name} transform={`translate(${x}, ${y}) rotate(${angle})`}>
            
            <text 
              x={0} y={-R_YEAR} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="14" 
              fontWeight="800" 
              fontFamily="'Metrophobic', sans-serif"
              fill="#000"
            >
              {g.name}
            </text>

            <line 
              x1={0} y1={-R_BAR_START} 
              x2={0} y2={-R_BAR_START - barHeight} 
              stroke={color} 
              strokeWidth={12}
              strokeLinecap="round"
            />
            
            <text 
              x={0} y={-R_BAR_START - barHeight - 32} 
              textAnchor="middle" 
              dominantBaseline="middle"
              fontSize="16" 
              fontWeight="800" 
              fontFamily="'Metrophobic', sans-serif"
              fill="#000"
              transform={angle < -90 || angle > 90 ? `rotate(180, 0, ${-R_BAR_START - barHeight - 32})` : ""}
            >
              {g.count}
            </text>
            
          </g>
        );
      })}
    </svg>
  );
}

function describeTopArc(x: number, y: number, radius: number, angle1: number, angle2: number) {
  function p2c(cx: number, cy: number, r: number, deg: number) {
    const rad = (deg - 90) * Math.PI / 180.0;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  
  const start = p2c(x, y, radius, angle1);
  const end = p2c(x, y, radius, angle2);
  
  const largeArcFlag = Math.abs(angle2 - angle1) <= 180 ? 0 : 1;
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(" ");
}
