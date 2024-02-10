import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

export default function Home() {
	async function upload(data: FormData) {
		'use server';

		const file: File = data.get('file') as unknown as File;

		if (!file) {
			throw new Error('Keine Datei ausgewählt oder die Datei ist leer.');
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadsDir = join(process.cwd(), 'public/uploads');
		const path = join(uploadsDir, file.name);

		// Sicherstellen, dass das Verzeichnis existiert
		await mkdir(uploadsDir, { recursive: true });

		await writeFile(path, buffer);

		const pdfUrl = `/uploads/${file.name}`;
		return { message: 'Datei erfolgreich hochgeladen.', pdfUrl };
	}
	return (
		<div className='flex flex-col'>
			<h1>Upload PDF to Server Test</h1>
			<form action={upload}>
				<input type='file' name='file' accept='application/pdf' />
				<button type='submit'>Upload</button>
			</form>
		</div>
	);
}
