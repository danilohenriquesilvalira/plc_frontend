import React from 'react';
import { Tag } from '../../services/api';

interface TagListProps {
  tags: Tag[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <ul>
      {tags.map((tag) => (
        <li key={tag.id}>{tag.name}</li>
      ))}
    </ul>
  );
};

export default TagList;
