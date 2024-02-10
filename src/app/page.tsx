import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import pdf from 'pdf-parse';

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

		// Verwendung von pdf-parse, um den Text aus der PDF-Datei zu extrahieren
		try {
			pdf(buffer).then(function (data) {
				// number of pages
				console.log(data.numpages);
				// number of rendered pages
				console.log(data.numrender);
				// PDF info
				console.log(data.info);
				// PDF metadata
				console.log(data.metadata);
				// PDF.js version
				// check https://mozilla.github.io/pdf.js/getting_started/
				console.log(data.version);
				// PDF text
				console.log(data.text);
			});
		} catch (error) {
			console.error('Fehler beim Parsen der PDF:', error);
			throw new Error('Fehler beim Parsen der PDF');
		}

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
