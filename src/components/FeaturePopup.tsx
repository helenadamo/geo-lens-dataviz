import React from 'react';
import { toTitleCase } from '../utils/formatters';

interface FeaturePopupProps {
  feature: any;
}

export default function FeaturePopup({ feature }: FeaturePopupProps) {
  const props = feature.properties || {};
  const entries = Object.entries(props).filter(([k, v]) => 
    v !== null && v !== undefined && k !== 'id'
  ).slice(0, 6); // Max 6 properties in popup to keep it compact

  return (
    <div style={{ padding: '12px 16px', minWidth: 200, fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-primary)' }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, paddingBottom: 8, borderBottom: '1px solid var(--panel-border)', marginBottom: 8 }}>
        Point Summary
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '4px 12px', alignItems: 'center' }}>
        {entries.map(([key, val]) => (
          <React.Fragment key={key}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: 500, alignSelf: 'start', whiteSpace: 'nowrap' }}>
              {toTitleCase(key.replace(/_/g, ' '))}
            </span>
            <span style={{ fontWeight: 400, wordBreak: 'break-word' }}>
              {String(val)}
            </span>
          </React.Fragment>
        ))}
      </div>
      {entries.length === 0 && (
        <span style={{ color: 'var(--text-muted)' }}>No properties available.</span>
      )}
    </div>
  );
}
