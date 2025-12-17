import { useState } from 'react'
import { UserList } from './components/UserList'
import { AddUserForm } from './components/AddUserForm'
import { User } from './types/User'
import './styles/App.css'

function App() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', createdAt: new Date() },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', createdAt: new Date() },
  ])

  const handleAddUser = (name: string, email: string) => {
    const newUser: User = {
      id: String(users.length + 1),
      name,
      email,
      createdAt: new Date(),
    }
    setUsers([...users, newUser])
  }

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 DevWorkflow Studio</h1>
        <p>WebApp Example with MCP Integration</p>
      </header>

      <main className="app-main">
        <section className="card">
          <h2>User Management</h2>
          <AddUserForm onAdd={handleAddUser} />
          <UserList users={users} onDelete={handleDeleteUser} />
        </section>

        <section className="card info">
          <h3>MCP Integration</h3>
          <p>This app demonstrates DevWorkflow Studio MCP server usage:</p>
          <ul>
            <li><strong>code-quality</strong>: Lint and format React/TypeScript</li>
            <li><strong>git-workflow</strong>: Automated branch and commit management</li>
            <li><strong>doc-generator</strong>: Auto-generate component documentation</li>
          </ul>
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
        <p>Powered by DevWorkflow Studio MCP Servers</p>
      </footer>
    </div>
  )
}

export default App
