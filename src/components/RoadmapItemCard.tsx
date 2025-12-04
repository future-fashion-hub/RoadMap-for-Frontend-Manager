import React from 'react';
import { Link } from 'react-router-dom';
import type { RoadmapItem } from '../utils/roadmapService';
import './RoadmapItemCard.css';

interface RoadmapItemCardProps {
  item: RoadmapItem;
}

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item }) => {
  const statusClass = `card-status-${item.status}`;

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU').format(date);
  };

  return (
    <Link to={`/item/${item.id}`} className="roadmap-item-card-link">
      <div className={`roadmap-item-card ${statusClass}`}>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        {item.dueDate && (
          <p className="due-date">
            <strong>Срок:</strong> {formatDate(item.dueDate)}
          </p>
        )}
      </div>
    </Link>
  );
};

export default RoadmapItemCard;
