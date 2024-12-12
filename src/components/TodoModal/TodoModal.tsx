import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { User } from '../../types/User';

import { getUser } from '../../api';
import { Loader } from '../Loader';

type Props = {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
};

export const TodoModal: React.FC<Props> = ({
  selectedTodo,
  setSelectedTodo,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const todoUserId = selectedTodo?.userId;

    if (todoUserId) {
      setLoading(true);
      getUser(todoUserId)
        .then(setSelectedUser)
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedTodo]);

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" onClick={() => setSelectedTodo(null)} />

      {loading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{selectedTodo?.id}
            </div>

            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={() => setSelectedTodo(null)}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {selectedTodo?.title}
            </p>

            <p className="block" data-cy="modal-user">
              <strong
                className={cn({
                  'has-text-success': selectedTodo?.completed,
                  'has-text-danger': !selectedTodo?.completed,
                })}
              >
                {selectedTodo?.completed ? 'Done' : 'Planned'}
              </strong>

              {' by '}

              {selectedUser && (
                <a href={`mailto:${selectedUser.email}`}>{selectedUser.name}</a>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
