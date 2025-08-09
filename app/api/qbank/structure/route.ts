import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const STRUCTURE_FILE = path.join(process.cwd(), 'data', 'qbank-structure.json');

async function readStructure() {
  try {
    const data = await fs.readFile(STRUCTURE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return [];
    }
    throw e;
  }
}

async function writeStructure(structure: any) {
  await fs.mkdir(path.dirname(STRUCTURE_FILE), { recursive: true });
  await fs.writeFile(STRUCTURE_FILE, JSON.stringify(structure, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const structure = await readStructure();
    return NextResponse.json(structure);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load structure' }, { status: 500 });
  }
}

// Replace full structure (simple admin management)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Structure must be an array' }, { status: 400 });
    }
    await writeStructure(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save structure' }, { status: 500 });
  }
}
