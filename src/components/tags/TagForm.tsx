import React, { useState } from 'react';

interface TagFormProps {
  onSubmit: (data: any) => void;
}

const TagForm: React.FC<TagFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
    setName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome da Tag"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default TagForm;
