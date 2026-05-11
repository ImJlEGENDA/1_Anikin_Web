import { useEffect, useState } from 'react';
import { useStore, type Note } from '../store';

// Мини-компонент для отдельной заметки
function NoteItem({ note }: { note: Note }) {
  const { updateNote, deleteNote } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Состояния для редактирования
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editBody, setEditBody] = useState(note.body);

  // Функция сохранения
  const handleSave = () => {
    if (editTitle.trim() && editBody.trim()) {
      updateNote(note.id, editTitle, editBody);
      setIsEditing(false); // Выходим из режима редактирования
    }
  };

  if (isEditing) {
    return (
      <li className="list-group-item bg-light">
        <input 
          className="form-control form-control-sm mb-2" 
          value={editTitle} 
          onChange={(e) => setEditTitle(e.target.value)} 
          placeholder="Название заметки..."
        />
        <textarea 
          className="form-control form-control-sm mb-2" 
          rows={2} 
          value={editBody} 
          onChange={(e) => setEditBody(e.target.value)} 
          placeholder="Текст заметки..."
        />
        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-sm btn-success" onClick={handleSave}>Сохранить</button>
          <button className="btn btn-sm btn-secondary" onClick={() => {
            // При отмене возвращаем старые значения
            setEditTitle(note.title);
            setEditBody(note.body);
            setIsEditing(false);
          }}>Отмена</button>
        </div>
      </li>
    );
  }

  // Показываем текст
  return (
    <li className="list-group-item">
      <div className="d-flex justify-content-between align-items-center">
        {/* Кликабельный заголовок */}
        <strong 
          className="text-primary" 
          style={{ cursor: 'pointer', flexGrow: 1 }} 
          onClick={() => setIsOpen(!isOpen)}
        >
          {note.title}
        </strong>
        
        <div className="text-nowrap ms-3">
          <button 
            className="btn btn-sm btn-outline-secondary me-2" 
            onClick={() => setIsEditing(true)}
          >✎</button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNote(note.id)}>✕</button>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-2 text-muted" style={{ borderTop: '1px dashed #ccc', paddingTop: '8px' }}>
          {note.body}
        </div>
      )}
    </li>
  );
}

// Главный компонент страницы
export default function Notes() {
  const { notes, isLoading, fetchNotes, addNote } = useStore();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Загружаем данные при первом открытии вкладки
  useEffect(() => {
    if (notes.length === 0) fetchNotes();
  }, []);

  const handleAdd = () => {
    if (title && body) {
      addNote({ title, body });
      setTitle('');
      setBody('');
    }
  };

  return (
    <section>
      <h2 className="mb-4">Управление заметками</h2>
      
      <div className="card shadow-sm border-0 mb-4 p-3">
        <h5 className="mb-3">Добавить новую заметку</h5>
        <input className="form-control mb-2" value={title} onChange={e => setTitle(e.target.value)} placeholder="Название..." />
        <textarea className="form-control mb-3" rows={2} value={body} onChange={e => setBody(e.target.value)} placeholder="Текст..."></textarea>
        <button className="btn btn-primary w-100" onClick={handleAdd}>Создать заметку</button>
      </div>

      <h4 className="mb-3">Список заметок</h4>
      {isLoading ? <p>Загрузка из API...</p> : (
        <ul className="list-group shadow-sm">
          {notes.map(note => (
            <NoteItem key={note.id} note={note} />
          ))}
        </ul>
      )}
    </section>
  );
}