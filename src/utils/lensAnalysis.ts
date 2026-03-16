export const analyzeLensMultiple = (
  features: any[],
  centerLngLat: [number, number],
  radiusMeters: number,
  selectedCategories: string[],
  categoryField: string = 'tipo',
  groupField: string = 'year'
): { insideFeatures: any[], stats: any[] } => {
  const insideFeatures = [] as any[];

  const categoryCounts: Record<string, { total: number, groups: Record<string, number> }> = {};
  for (const cat of selectedCategories) {
    categoryCounts[cat] = { total: 0, groups: {} };
  }

  const DEG_TO_RAD = Math.PI / 180;
  const R_EARTH = 6371000;
  const cosLat = Math.cos(centerLngLat[1] * DEG_TO_RAD);
  
  const mPerDegLat = R_EARTH * DEG_TO_RAD;
  const mPerDegLng = mPerDegLat * cosLat;
  
  const dLat = radiusMeters / mPerDegLat;
  const dLng = radiusMeters / mPerDegLng;
  
  const minLng = centerLngLat[0] - dLng;
  const maxLng = centerLngLat[0] + dLng;
  const minLat = centerLngLat[1] - dLat;
  const maxLat = centerLngLat[1] + dLat;
  
  const rSq = radiusMeters * radiusMeters;

  for (const feature of features) {
    if (feature.geometry?.type !== 'Point') continue;
    
    const props = feature.properties || {};
    const cat = props[categoryField];
    if (!selectedCategories.includes(cat)) continue;
    const coords = feature.geometry.coordinates;
    const lng = coords[0];
    const lat = coords[1];

    if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) continue;
    const dx = (lng - centerLngLat[0]) * mPerDegLng;
    const dy = (lat - centerLngLat[1]) * mPerDegLat;
    const distSq = dx * dx + dy * dy;
    
    if (distSq <= rSq) {
      insideFeatures.push(feature);
      categoryCounts[cat].total++;
      
      const year = String(props[groupField] || 'Unknown');
      categoryCounts[cat].groups[year] = (categoryCounts[cat].groups[year] || 0) + 1;
    }
  }

  const stats = selectedCategories.map(cat => {
    const sortedGroups = Object.entries(categoryCounts[cat].groups)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return {
      category: cat,
      totalPoints: categoryCounts[cat].total,
      groups: sortedGroups
    };
  });

  return { insideFeatures, stats };
};
