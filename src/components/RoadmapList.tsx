import React from 'react';
import type { RoadmapItem } from '../utils/roadmapService';
import RoadmapItemCard from './RoadmapItemCard';
import '../styles/RoadmapList.css';

interface RoadmapListProps {
  items: RoadmapItem[];
}

const RoadmapList: React.FC<RoadmapListProps> = ({ items }) => {
  return (
    <div className="roadmap-list-grid">
      {items.map((item) => (
        <RoadmapItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default RoadmapList;
