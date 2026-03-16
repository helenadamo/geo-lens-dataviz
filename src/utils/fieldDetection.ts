export const CATEGORY_PRIORITY = [
  'tipo', 'tipo_acid', 'category', 'type', 'classe', 'class', 
  'subtype', 'grupo', 'natureza', 'kind', 'label'
];

export const detectCategoryField = (properties: Record<string, any>): string | null => {
  if (!properties) return null;
  const keys = Object.keys(properties).map(k => k.toLowerCase());
  
  for (const prio of CATEGORY_PRIORITY) {
    if (keys.includes(prio)) {
      return Object.keys(properties).find(k => k.toLowerCase() === prio) || null;
    }
  }

  // Fallback: mostly strings, short strings are good candidates
  const strFields = Object.keys(properties).filter(k => 
    typeof properties[k] === 'string' && 
    properties[k].length < 50 &&
    !k.toLowerCase().includes('id')
  );

  return strFields.length > 0 ? strFields[0] : null;
};

export const METRIC_FIELDS = [
  'feridos', 'mortes', 'noite_dia', 'regiao', 
  'injured', 'deaths', 'day_night', 'region'
];

export const detectMetricFields = (properties: Record<string, any>) => {
  if (!properties) return [];
  const keys = Object.keys(properties);
  return keys.filter(k => 
    METRIC_FIELDS.includes(k.toLowerCase()) || 
    typeof properties[k] === 'number'
  );
};
