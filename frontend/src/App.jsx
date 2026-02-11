import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentInterface from './components/AssessmentInterface';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'assessment'

  return (
    <div className="app-container">
      <Sidebar />

      {/* Simulation for switching views */}
      {view === 'dashboard' ? (
        <div style={{ position: 'relative' }}>
          <Dashboard />
          <button
            className="btn"
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              background: 'var(--accent)',
              color: 'var(--bg-dark)'
            }}
            onClick={() => setView('assessment')}
          >
            Demo Quiz
          </button>
        </div>
      ) : (
        <div className="main-content">
          <button
            className="btn"
            style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.1)' }}
            onClick={() => setView('dashboard')}
          >
            ← Back to Dashboard
          </button>
          <AssessmentInterface />
        </div>
      )}
    </div>
  );
}

export default App;
