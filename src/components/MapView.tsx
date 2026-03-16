import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import LensOverlay from './LensOverlay';
import { CATEGORY_COLORS } from '../utils/sampleData';

interface MapViewProps {
  features: any[];
  visibleFeatures: any[];
  lensCenter: [number, number] | null;
  lensRadius: number;
  stats: any[];
  selectedCategories: string[];
  onLensDrag: (cx: number, cy: number) => void;
  onCategoryDrop: (cat: string, lngLat: [number, number]) => void;
}

export interface MapViewHandle {
  getMap: () => L.Map | null;
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(({
  features,
  visibleFeatures,
  lensCenter,
  lensRadius,
  stats,
  selectedCategories,
  onLensDrag,
  onCategoryDrop
}: MapViewProps, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const [lensPixelData, setLensPixelData] = useState<{ x: number, y: number, r: number } | null>(null);

  useImperativeHandle(ref, () => ({
    getMap: () => mapInstance.current
  }));

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      preferCanvas: true
    }).setView([-30.0346, -51.2177], 15);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);
    mapInstance.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !features || features.length === 0) return;
  }, [features]);

  useEffect(() => {
    const mapContainer = mapInstance.current?.getContainer();
    if (!mapContainer || !mapInstance.current) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      const cat = e.dataTransfer?.getData('application/category');
      if (cat && mapInstance.current) {
        const rect = mapContainer.getBoundingClientRect();
        const pt = L.point(e.clientX - rect.left, e.clientY - rect.top);
        const latlng = mapInstance.current.containerPointToLatLng(pt);
        onCategoryDrop(cat, [latlng.lng, latlng.lat]);
      }
    };

    mapContainer.addEventListener('dragover', handleDragOver);
    mapContainer.addEventListener('drop', handleDrop);

    return () => {
      mapContainer.removeEventListener('dragover', handleDragOver);
      mapContainer.removeEventListener('drop', handleDrop);
    };
  }, [onCategoryDrop]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const updatePixelData = () => {
      if (!lensCenter) {
        setLensPixelData(null);
        return;
      }

      const centerLatLng = L.latLng(lensCenter[1], lensCenter[0]);
      const pt = map.latLngToContainerPoint(centerLatLng);

      const earthRadius = 6378137;
      const dLng = (lensRadius / earthRadius) * (180 / Math.PI) / Math.cos(lensCenter[1] * Math.PI / 180);
      const edgeLatLng = L.latLng(lensCenter[1], lensCenter[0] + dLng);

      const edgePt = map.latLngToContainerPoint(edgeLatLng);
      const pxRadius = Math.abs(edgePt.x - pt.x);

      setLensPixelData({ x: pt.x, y: pt.y, r: pxRadius });
    };

    updatePixelData();
    map.on('move', updatePixelData);
    map.on('zoom', updatePixelData);

    return () => {
      map.off('move', updatePixelData);
      map.off('zoom', updatePixelData);
    };
  }, [lensCenter, lensRadius]);

  useEffect(() => {
    if (!markersLayer.current) return;
    const layer = markersLayer.current;

    const pointsToRender = visibleFeatures;

    requestAnimationFrame(() => {
      layer.clearLayers();
      
      pointsToRender.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties || {};
        const pointColor = CATEGORY_COLORS[props.tipo] || '#000000';
        
        const marker = L.circleMarker([coords[1], coords[0]], {
          radius: 5,
          color: '#ffffff',
          weight: 1.5,
          fillColor: pointColor,
          fillOpacity: 0.8,
        });

        const entries = Object.entries(props).filter(([k, v]) => v && k !== 'id').slice(0, 6);
        const html = `
          <div style="padding:12px; font-family:'Metrophobic',sans-serif;">
            <h3 style="margin:0 0 8px 0; border-bottom:1px solid #ccc; padding-bottom:8px;">Ponto de Acidente</h3>
            <div style="display:grid; grid-template-columns:auto 1fr; gap:4px 12px; font-size:13px;">
              ${entries.map(([k, v]) => `<span style="color:#666;font-weight:bold;">${k}</span><span>${v}</span>`).join('')}
            </div>
          </div>
        `;

        marker.bindPopup(html);
        marker.addTo(layer);
      });
    });
  }, [visibleFeatures]);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} id="leaflet-map" />
      {lensPixelData && (
        <LensOverlay
          x={lensPixelData.x}
          y={lensPixelData.y}
          r={lensPixelData.r}
          stats={stats}
          categories={selectedCategories}
          onLensDrag={onLensDrag}
        />
      )}
    </>
  );
});

export default MapView;
