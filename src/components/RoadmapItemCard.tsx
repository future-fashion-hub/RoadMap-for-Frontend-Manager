import React from 'react';
import { Link } from 'react-router-dom';
import type { RoadmapItem } from '../utils/roadmapService';
import '../styles/RoadmapItemCard.css';
import { CheckCircle, Play, Circle, Clock, ExternalLink } from 'lucide-react';

interface RoadmapItemCardProps {
  item: RoadmapItem;
}

const RoadmapItemCard: React.FC<RoadmapItemCardProps> = ({ item }) => {
  const statusClass = `card-status-${item.status}`;

  const statusIcon = () => {
    if (item.status === 'completed') return <CheckCircle size={16} />;
    if (item.status === 'in-progress') return <Play size={16} />;
    return <Circle size={16} />;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU').format(date);
  };

  return (
    <Link to={`/item/${item.id}`} className="roadmap-item-card-link">
      <div className={`roadmap-item-card ${statusClass}`}>
        <h3>
          <span className="status-badge" aria-hidden>{statusIcon()}</span>
          {item.name}
        </h3>
        <p className="item-desc">{item.description}</p>

        <div className="card-meta">
          {item.dueDate && (
            <span className="due-date"><Clock size={14} /> <span>Срок: {formatDate(item.dueDate)}</span></span>
          )}

          {item.externalLink && (
            <a className="external-link" href={item.externalLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} />
              <span style={{marginLeft:6}}>Узнать больше</span>
            </a>
          )}
        </div>
      </div>
    </Link>
  );
};

export default RoadmapItemCard;
