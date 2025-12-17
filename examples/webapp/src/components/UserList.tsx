import { User } from '../types/User'
import '../styles/UserList.css'

interface UserListProps {
  users: User[]
  onDelete: (id: string) => void
}

export function UserList({ users, onDelete }: UserListProps) {
  return (
    <div className="user-list">
      <h3>Users ({users.length})</h3>
      {users.length === 0 ? (
        <p className="empty-state">No users yet. Add one above!</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="user-item">
              <div className="user-info">
                <strong>{user.name}</strong>
                <span className="user-email">{user.email}</span>
              </div>
              <button
                onClick={() => onDelete(user.id)}
                className="delete-btn"
                aria-label={`Delete ${user.name}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
