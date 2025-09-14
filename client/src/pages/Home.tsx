import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">RCA Intelligence Pro</h1>
      <p className="mb-4">AI-Powered Root Cause Analysis Platform</p>
      <Link to="/admin" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Access Admin Panel
      </Link>
    </div>
  );
}