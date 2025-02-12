import { NextResponse } from 'next/server';
import prisma from '@/utils/dbConnect';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Type for creating/updating a user
interface UserInput {
  name: string;
  email: string;
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Error fetching users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email }: UserInput = await request.json();
    
    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        id: uuidv4(), // Generate a UUID for the id field
        name,
        email,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, name, email }: UserInput & { id: string } = await request.json();

    if (!id || !name || !email) {
      return NextResponse.json(
        { message: 'ID, Name and Email are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
      if (error.code === 'P2002') {
        return NextResponse.json(
          { message: 'Email already exists' },
          { status: 400 }
        );
      }
    }
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Error updating user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id }: { id: string } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { message: 'ID is required' },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
    }
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Error deleting user' },
      { status: 500 }
    );
  }
}