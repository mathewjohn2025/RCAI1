import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function Home() {
  const loc = useLocation();
  console.log('[HOME_CANARY] Home mounted at', loc.pathname);

  return (
    <div>
      <div style={{background:'#cde9ff', padding:8, marginBottom:8}}>
        🏠 HOME CANARY — path: {loc.pathname}
      </div>

      <h1>RCA Intelligence Pro</h1>
      <p>AI-Powered Root Cause Analysis Platform</p>
      
      <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
        <Link to="/incidents/new" style={{padding: '8px 16px', background: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>
          Report New Incident
        </Link>
        <Link to="/admin" style={{padding: '8px 16px', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>
          Admin Panel
        </Link>
      </div>
    </div>
  );
}