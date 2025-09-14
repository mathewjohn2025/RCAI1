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
      <Link to="/admin" className="btn">Access Admin Panel</Link>
    </div>
  );
}