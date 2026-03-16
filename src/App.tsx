import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import MapView, { type MapViewHandle } from './components/MapView';
import { CATEGORY_COLORS } from './utils/sampleData';
import { analyzeLensMultiple } from './utils/lensAnalysis';
import { Car, Zap, PersonStanding, RotateCcw, Truck, BookOpen } from 'lucide-react';
import poaDataUrl from './assets/acidentes_poa.geojson?url';

const ICON_PROPS = { size: 28, strokeWidth: 1.5, color: '#000' };

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'ABALROAMENTO': <Truck {...ICON_PROPS} />,
  'COLISÃO': <Car {...ICON_PROPS} />,
  'ATROPELAMENTO': <PersonStanding {...ICON_PROPS} />,
  'CHOQUE': <Zap {...ICON_PROPS} />,
  'CAPOTAGEM': <RotateCcw {...ICON_PROPS} />
};

export default function App() {
  const [allFeatures, setAllFeatures] = useState<any[]>([]);
  
  const [lensCenter, setLensCenter] = useState<[number, number] | null>(null);
  const [lensRadius, setLensRadius] = useState<number>(400);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showDictionary, setShowDictionary] = useState(false);
  const mapRef = useRef<MapViewHandle>(null);

  const loadSampleData = useCallback(async () => {
    try {
      const res = await fetch(poaDataUrl);
      const data = await res.json();
      setAllFeatures(data.features);
      setLensCenter(null);
      setSelectedCategories([]);
    } catch (e) {
      console.error(e);
      alert('Failed to load the dataset.');
    }
  }, []);

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  const analysis = useMemo(() => {
    if (allFeatures.length === 0 || !lensCenter || selectedCategories.length === 0) return null;
    return analyzeLensMultiple(allFeatures, lensCenter, lensRadius, selectedCategories, 'tipo', 'year');
  }, [allFeatures, lensCenter, lensRadius, selectedCategories]);

  const frameRef = useRef<number | null>(null);

  const handleLensDrag = (cx: number, cy: number) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    
    frameRef.current = requestAnimationFrame(() => {
      const map = mapRef.current?.getMap();
      if (!map) return;
      
      const latlng = map.containerPointToLatLng([cx, cy]);
      setLensCenter([latlng.lng, latlng.lat]);
    });
  };

  const handleCategoryDrop = (cat: string, lngLat: [number, number]) => {
    setLensCenter(lngLat);
    setSelectedCategories(prev => {
      if (prev.includes(cat)) return prev;
      if (prev.length >= 2) return [prev[1], cat];
      return [...prev, cat];
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(cat)) return prev.filter(c => c !== cat);
      if (prev.length >= 2) return [prev[1], cat];
      return [...prev, cat];
    });
    if (!lensCenter) {
      setLensCenter([-51.2177, -30.0346]);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <MapView 
        ref={mapRef}
        features={allFeatures}
        visibleFeatures={analysis?.insideFeatures || []}
        lensCenter={lensCenter}
        lensRadius={lensRadius}
        selectedCategories={selectedCategories}
        stats={analysis?.stats || []}
        onLensDrag={handleLensDrag}
        onCategoryDrop={handleCategoryDrop}
      />

      <div className="top-bar">
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
          <h1 style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            color: '#ffffff', 
            margin: 0, 
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            Acidentes de Trânsito
          </h1>
          <p style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: '#888888', 
            margin: 0,
            marginTop: 4,
            letterSpacing: '-0.01em',
            whiteSpace: 'nowrap'
          }}>
            Porto Alegre
          </p>
        </div>

        <div className="top-bar-separator" style={{ width: '2px', height: '40px', background: '#333', flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', overflow: 'hidden' }}>
          <div className="category-list">
            {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => {
            const color = CATEGORY_COLORS[cat] || '#ffffff';
            const isSelected = selectedCategories.includes(cat);
            return (
              <div 
                key={cat}
                className="category-chip"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/category', cat);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
                onClick={() => handleCategoryClick(cat)}
                style={{
                  display: 'flex', 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  gap: 12,
                  cursor: 'grab',
                  height: 48, 
                  borderRadius: '24px 24px 24px 6px',
                  padding: '0 20px 0 12px',
                  background: color,
                  opacity: isSelected ? 1 : 0.6,
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: isSelected ? `0 8px 16px ${color}60` : 'none',
                  border: isSelected ? '4px solid #fff' : '4px solid transparent',
                  boxSizing: 'border-box',
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>{icon}</div>
                <span style={{ 
                  fontSize: 14, 
                  fontWeight: 800, 
                  color: '#000',
                  letterSpacing: '-0.02em',
                  textTransform: 'uppercase',
                  lineHeight: 1
                }}>
                  {cat.length > 20 ? cat.substring(0, 19) + '.' : cat}
                </span>
              </div>
            );
          })}
          </div>
          <span className="top-bar-separator mobile-hide" style={{ fontSize: 11, color: '#666', fontWeight: 600, paddingLeft: 8 }}>
            Arraste e solte no mapa · Ou clique para ativar
          </span>
        </div>

        <div className="dictionary-wrapper">
          <div 
            onClick={() => setShowDictionary(!showDictionary)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: '24px',
              background: showDictionary ? '#333' : '#1a1a1a',
              color: '#fff',
              cursor: 'pointer',
              transition: 'background 0.2s',
              fontWeight: 800,
              fontSize: 14,
              border: '1px solid #333'
            }}
          >
            <BookOpen size={20} strokeWidth={1.5} />
            Dicionário
          </div>
          
          {showDictionary && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 16,
              background: '#111',
              border: '1px solid #333',
              borderRadius: '24px 8px 24px 24px',
              padding: '24px',
              width: 320,
              boxShadow: '0 24px 48px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              zIndex: 2000
            }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 800 }}>Dicionário</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: CATEGORY_COLORS['COLISÃO'], fontWeight: 800, fontSize: 14 }}>COLISÃO</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>veículo × veículo</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: CATEGORY_COLORS['ABALROAMENTO'], fontWeight: 800, fontSize: 14 }}>ABALROAMENTO</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>veículo × veículo (batida lateral)</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: CATEGORY_COLORS['CHOQUE'], fontWeight: 800, fontSize: 14 }}>CHOQUE</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>veículo × objeto fixo</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ color: CATEGORY_COLORS['ATROPELAMENTO'], fontWeight: 800, fontSize: 14 }}>ATROPELAMENTO</div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>veículo × pedestre</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bottom-bar">
        <label style={{ 
          fontSize: 14, 
          fontWeight: 800, 
          color: '#ffffff',
          letterSpacing: '-0.02em',
          fontFamily: "'Metrophobic', sans-serif"
        }}>
          Raio: {Math.round(lensRadius)}m
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
          <input 
            type="range" 
            min="200" max="5000" step="50"
            value={lensRadius}
            onChange={e => setLensRadius(Number(e.target.value))}
            style={{ 
              width: 240, 
              accentColor: selectedCategories.length > 0 ? CATEGORY_COLORS[selectedCategories[0]] : '#fff',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>
    </div>
  );
}
