import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AssessmentInterface from './components/AssessmentInterface';
import LessonCreate from './components/LessonCreate';
import Library from './components/Library';
import CoachingPage from './components/CoachingPage';
import LandingPage from './components/LandingPage';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('simplish_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleAuthSuccess = (userData, token) => {
    const userWithAuth = { ...userData, isLoggedIn: true, token };
    localStorage.setItem('simplish_user', JSON.stringify(userWithAuth));
    localStorage.setItem('simplish_token', token);
    setUser(userWithAuth);
    setView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('simplish_user');
    localStorage.removeItem('simplish_token');
    setUser(null);
    setView('dashboard');
  };

  const handleNavigate = (newView) => {
    if (newView === 'admin' && user.role !== 'Admin') {
      alert("Access Denied: Admins Only");
      return;
    }
    setView(newView);
  };

  const startLesson = (lesson) => {
    setSelectedLesson(lesson);
    setView('coaching');
  };

  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="app-container">
      <Sidebar onNavigate={handleNavigate} currentView={view} user={user} onLogout={handleLogout} />

      <div className="main-content">
        {view === 'dashboard' && (
          <div style={{ position: 'relative' }}>
            <Dashboard user={user} />
            <button
              className="btn"
              style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                background: 'var(--accent)',
                color: '#ffffff'
              }}
              onClick={() => setView('assessment')}
            >
              Demo Quiz
            </button>
          </div>
        )}

        {view === 'library' && (
          <Library
            onSelectLesson={(lesson) => startLesson(lesson)}
            onEditLesson={(lesson) => {
              if (user.role !== 'Admin') return alert("Admins Only");
              setSelectedLesson(lesson);
              setView('edit_lesson');
            }}
            onAddLesson={() => {
              if (user.role !== 'Admin') return alert("Admins Only");
              setSelectedLesson(null);
              setView('admin');
            }}
          />
        )}

        {view === 'coaching' && (
          <CoachingPage
            lesson={selectedLesson}
            onComplete={() => setView('assessment')}
            onBack={() => setView('library')}
          />
        )}

        {view === 'assessment' && (
          <div>
            <button
              className="btn"
              style={{ marginBottom: '2rem', background: 'var(--bg-dark)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
              onClick={() => setView('coaching')}
            >
              ← Back to coaching
            </button>
            <AssessmentInterface lessonId={selectedLesson?.id} />
          </div>
        )}

        {(view === 'admin' || view === 'edit_lesson') && (
          <LessonCreate
            lesson={view === 'edit_lesson' ? selectedLesson : null}
            onBack={() => setView('library')}
          />
        )}
      </div>
    </div>
  );
}

export default App;
