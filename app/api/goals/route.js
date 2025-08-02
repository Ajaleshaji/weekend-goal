// app/api/goals/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Goal from '@/models/Goal';

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'personal';

  const goals = await Goal.find({ category }).sort({ createdAt: 1 });
  return NextResponse.json(goals);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const newGoal = await Goal.create({
    text: body.text,
    done: body.done || false,
    category: body.category || 'personal',
  });

  return NextResponse.json(newGoal);
}

