import React, { useState, useCallback, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import type { Roadmap, RoadmapItem} from './utils/roadmapService';
import { loadRoadmap, exportRoadmap } from './utils/roadmapService';
import RoadmapList from './components/RoadmapList';
import RoadmapDetailPage from './components/RoadmapDetailPage';
import './styles/App.css';

function App() {
  const [roadmaps, setRoadmaps] = useState<Record<string, Roadmap>>({});
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const activeRoadmap = activeRoadmapId ? roadmaps[activeRoadmapId] : null;

  const calculateProgress = useMemo(() => {
    if (!activeRoadmap || activeRoadmap.items.length === 0) return 0;
    const completedItems = activeRoadmap.items.filter(item => item.status === 'completed').length;
    return Math.round((completedItems / activeRoadmap.items.length) * 100);
  }, [activeRoadmap]);

  const handleLoadRoadmap = async (roadmapId: string, roadmapFile: string) => {
    setError(null);
    if (roadmaps[roadmapId]) {
      setActiveRoadmapId(roadmapId);
    } else {
      try {
        const response = await fetch(roadmapFile);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Roadmap = await response.json();
        setRoadmaps(prev => ({ ...prev, [roadmapId]: data }));
        setActiveRoadmapId(roadmapId);
      } catch (err) {
        setError('Не удалось загрузить дорожную карту.');
        console.error(err);
      }
    }
    navigate('/');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setError(null);
        const loadedRoadmap = await loadRoadmap(file);
        const fileId = `file-${Date.now()}`; // Create a simple unique ID for the uploaded file
        setRoadmaps(prev => ({ ...prev, [fileId]: loadedRoadmap }));
        setActiveRoadmapId(fileId);
        console.log('Дорожная карта загружена:', loadedRoadmap);
        navigate('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла неизвестная ошибка.');
      }
    }
  };

  const handleExportRoadmap = () => {
    if (activeRoadmap) {
      exportRoadmap(activeRoadmap, `${activeRoadmap.name.toLowerCase().replace(/\s/g, '-')}-progress.json`);
    }
  };

  const handleUpdateRoadmapItem = useCallback((updatedItem: RoadmapItem) => {
    if (!activeRoadmapId) return;
    setRoadmaps(prev => {
      const newRoadmaps = { ...prev };
      const currentRoadmap = newRoadmaps[activeRoadmapId];
      if (currentRoadmap) {
        const updatedItems = currentRoadmap.items.map(item =>
          item.id === updatedItem.id ? updatedItem : item
        );
        newRoadmaps[activeRoadmapId] = { ...currentRoadmap, items: updatedItems };
      }
      return newRoadmaps;
    });
  }, [activeRoadmapId]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Трекер освоения технологий</h1>
        <div className="controls">
          <div className="load-controls">
            <p>Загрузите свой файл:</p>
            <input type="file" accept=".json" onChange={handleFileUpload} />
          </div>
          <div className="example-controls">
            <p>Или выберите один из примеров:</p>
            <button onClick={() => handleLoadRoadmap('react', '/react-roadmap.json')}>React</button>
            <button onClick={() => handleLoadRoadmap('vue', '/vue-roadmap.json')}>Vue.js</button>
            <button onClick={() => handleLoadRoadmap('javascript', '/javascript-roadmap.json')}>JavaScript</button>
          </div>
        </div>
        {activeRoadmap && (
          <div className="roadmap-info">
            <h2>{activeRoadmap.name}</h2>
            <div className="progress-container">
              <span>Прогресс: {calculateProgress}%</span>
              <progress value={calculateProgress} max="100"></progress>
            </div>
            <button onClick={handleExportRoadmap}>Экспорт дорожной карты</button>
          </div>
        )}
        {error && <p className="error-message">{error}</p>}
      </header>
      <main>
        <Routes>
          <Route path="/" element={
            activeRoadmap ? (
              <RoadmapList items={activeRoadmap.items} />
            ) : (
              <div className="welcome-message">
                <h2>Добро пожаловать!</h2>
                <p>Пожалуйста, загрузите JSON-файл дорожной карты или выберите пример, чтобы начать.</p>
              </div>
            )
          } />
          <Route
            path="/item/:itemId"
            element={<RoadmapDetailPage roadmap={activeRoadmap} onUpdateRoadmapItem={handleUpdateRoadmapItem} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
