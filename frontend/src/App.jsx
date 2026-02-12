import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentInterface from './components/AssessmentInterface';
import LessonCreate from './components/LessonCreate';

import Library from './components/Library';

function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard', 'assessment', 'admin', 'library'
  const [selectedLesson, setSelectedLesson] = useState(null);

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setView('assessment');
  };

  return (
    <div className="app-container">
      <Sidebar onNavigate={setView} currentView={view} />

      <div className="main-content" style={{ marginLeft: '260px', padding: '2.5rem' }}>
        {view === 'dashboard' && (
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
        )}

        {view === 'library' && (
          <Library onSelectLesson={(lesson) => startLesson(lesson)} />
        )}

        {view === 'assessment' && (
          <div>
            <button
              className="btn"
              style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => setView('library')}
            >
              ← Back to Library
            </button>
            <AssessmentInterface lesson={selectedLesson} />
          </div>
        )}

        {view === 'admin' && (
          <LessonCreate onBack={() => setView('dashboard')} />
        )}
      </div>
    </div>
  );
}

export default App;
