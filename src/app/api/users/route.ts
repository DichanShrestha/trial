import client, { dbConnect } from '@/app/utils/dbConnect';
import { NextResponse } from 'next/server';

// Connect to the database when the API route is used
dbConnect();

// Interface for User
interface User {
  id: number;
  name: string;
  email: string;
}

export async function GET() {
  try {
    const result = await client.query<User>('SELECT * FROM users');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.error();
  }
}

export async function POST(request: Request) {
  const { name, email } = await request.json();
  
  if (!name || !email) {
    return NextResponse.json({ message: 'Name and email are required' }, { status: 400 });
  }

  try {
    const result = await client.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { id, name, email } = await request.json();

  if (!id || !name || !email) {
    return NextResponse.json({ message: 'ID, Name and Email are required' }, { status: 400 });
  }

  try {
    const result = await client.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  }
}
