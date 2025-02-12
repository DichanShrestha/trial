// app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [updateName, setUpdateName] = useState('');
  const [updateEmail, setUpdateEmail] = useState('');

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
        const res = await fetch('/api/users');
        
        // Check if the response is OK and contains content
        if (res.ok) {
          try {
            const data = await res.json();
            setUsers(data);
          } catch (error) {
            console.error('Failed to parse response as JSON:', error);
          }
        } else {
          console.error('Failed to fetch users:', res.status);
        }
      };
      

    fetchUsers();
  }, []);

  // Handle user form submission (for creating a new user)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (name && email) {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      const newUser = await res.json();
      setUsers([...users, newUser]);
      setName('');
      setEmail('');
    }
  };

  // Handle update user form submission
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (updateId && updateName && updateEmail) {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: updateId, name: updateName, email: updateEmail }),
      });

      const updatedUser = await res.json();
      setUsers(users.map((user) => (user.id === updateId ? updatedUser : user)));
      setUpdateId(null);
      setUpdateName('');
      setUpdateEmail('');
    }
  };

  // Handle delete user
  const handleDelete = async (id: number) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (res.status === 204) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div>
      <h1>User Management</h1>

      {/* Add New User Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add User</button>
      </form>

      <hr />

      {/* Update User Form */}
      {updateId && (
        <form onSubmit={handleUpdateSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={updateName}
              onChange={(e) => setUpdateName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={updateEmail}
              onChange={(e) => setUpdateEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update User</button>
        </form>
      )}

      <hr />

      {/* Users List */}
      <h2>Users List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.name}</strong> - {user.email}
            <button onClick={() => { setUpdateId(user.id); setUpdateName(user.name); setUpdateEmail(user.email); }}>Edit</button>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
