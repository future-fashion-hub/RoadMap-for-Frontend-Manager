import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Roadmap, RoadmapItem } from '../utils/roadmapService';
import './RoadmapDetailPage.css';

interface RoadmapDetailPageProps {
  roadmap: Roadmap | null;
  onUpdateRoadmapItem: (updatedItem: RoadmapItem) => void;
}

const RoadmapDetailPage: React.FC<RoadmapDetailPageProps> = ({ roadmap, onUpdateRoadmapItem }) => {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  if (!roadmap) {
    return <p>Дорожная карта не загружена.</p>;
  }

  const item = roadmap.items.find(i => i.id === itemId);

  if (!item) {
    return <p>Пункт не найден.</p>;
  }

  // Обработчики для обновления статуса, заметок и даты
  const handleStatusChange = (newStatus: RoadmapItem['status']) => {
    const updatedItem = { ...item, status: newStatus };
    onUpdateRoadmapItem(updatedItem);
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updatedItem = { ...item, notes: event.target.value };
    onUpdateRoadmapItem(updatedItem);
  };

  const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedItem = { ...item, dueDate: event.target.value };
    onUpdateRoadmapItem(updatedItem);
  };

  return (
    <div className="roadmap-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">Назад к дорожной карте</button>
      <div className="detail-content">
        <h2>{item.name}</h2>
        <p>{item.description}</p>
        {item.externalLink && <p><a href={item.externalLink} target="_blank" rel="noopener noreferrer">Узнать больше</a></p>}

        <div className="item-controls">
          <div className="control-group">
            <label htmlFor="status-select">Статус:</label>
            <select id="status-select" value={item.status} onChange={(e) => handleStatusChange(e.target.value as RoadmapItem['status'])}>
              <option value="not-started">Не начат</option>
              <option value="in-progress">В работе</option>
              <option value="completed">Выполнено</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="due-date">Дата окончания:</label>
            <input
              type="date"
              id="due-date"
              value={item.dueDate || ''}
              onChange={handleDueDateChange}
            />
          </div>
        </div>

        <div className="notes-section">
          <h3>Заметки</h3>
          <textarea
            value={item.notes || ''}
            onChange={handleNotesChange}
            placeholder="Добавьте свои заметки здесь..."
            rows={8}
          />
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetailPage;
