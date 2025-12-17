import { useState, FormEvent } from 'react'
import '../styles/AddUserForm.css'

interface AddUserFormProps {
  onAdd: (name: string, email: string) => void
}

export function AddUserForm({ onAdd }: AddUserFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim()) {
      alert('Please fill in all fields')
      return
    }

    onAdd(name, email)
    setName('')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="add-user-form">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Add User</button>
    </form>
  )
}
