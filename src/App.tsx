import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { TodoModal } from './components/TodoModal';
import { TodoFilter } from './components/TodoFilter';
import { getTodos } from './api';
import { Loader } from './components/Loader';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<string>('all');

  const filterTodos = (
    todosArray: Todo[],
    searchQuery: string,
    currentStatus: string,
  ) => {
    return todosArray
      .filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.trim().toLowerCase()),
      )
      .filter(todo => {
        switch (currentStatus) {
          case 'completed':
            return todo.completed;

          case 'active':
            return !todo.completed;

          case 'all':
          default:
            return true;
        }
      });
  };

  const filteredTodos = filterTodos(todos, query, status);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                query={query}
                setQuery={setQuery}
                status={status}
                setStatus={setStatus}
              />
            </div>

            <div className="block">
              {loading ? (
                <Loader />
              ) : (
                <TodoList
                  todos={filteredTodos}
                  selectedTodo={selectedTodo}
                  setSelectedTodo={setSelectedTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
        />
      )}
    </>
  );
};
