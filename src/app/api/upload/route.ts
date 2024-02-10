import { mkdir, writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { toast } from 'sonner';

export async function POST(req: NextRequest) {
	const data = await req.formData();
	const file: File | null = data.get('file') as unknown as File;

	if (!file) {
		return NextResponse.json({ success: false });
	}

	//converting web pdf to bytes that node js can understand
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);
	//every buffer is fine for nodejs

	const uploadsDir = join(process.cwd(), 'public/uploads');
	const path = join(uploadsDir, file.name);

	// Sicherstellen, dass das Verzeichnis existiert
	await mkdir(uploadsDir, { recursive: true });

	await writeFile(path, buffer);

	console.log(`File uploaded to ${path}`);

	return NextResponse.json({ success: true });
}
