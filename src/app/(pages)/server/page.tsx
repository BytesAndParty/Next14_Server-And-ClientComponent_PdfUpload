import { mkdir, writeFile } from 'fs/promises';
import Link from 'next/link';
import { join } from 'path';
import pdf from 'pdf-parse';

const ServerPage = () => {
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
				console.log('data.numpages: ' + data.numpages);
				console.log('data.info: ');
				console.log(data.info);
				console.log('data.text: ' + data.text);
			});
		} catch (error) {
			console.error('Fehler beim Parsen der PDF:', error);
			throw new Error('Fehler beim Parsen der PDF');
		}

		const pdfUrl = `/uploads/${file.name}`;
		return { message: 'Datei erfolgreich hochgeladen.', pdfUrl };
	}

	return (
		<div className='items-center flex flex-col'>
			<h1 className='text-2xl m-4 '>Upload PDF via Server Component</h1>
			<Link href='/client'>
				go back to <span className='text-blue-500'>Client Component</span>
			</Link>
			<form action={upload} className='mt-20 flex flex-col'>
				<input
					className='m-4'
					type='file'
					name='file'
					accept='application/pdf'
				/>
				<button className='m-4 boroder bg-gray-700 rounded' type='submit'>
					Upload
				</button>
			</form>
		</div>
	);
};

export default ServerPage;
