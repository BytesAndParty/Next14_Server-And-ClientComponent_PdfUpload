'use server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Speichert eine hochgeladene PDF-Datei und gibt die URL zurück.
 *
 * @param {FormData} formData - Das FormData-Objekt mit der hochgeladenen Datei.
 * @returns {Promise<{message: string, pdfUrl?: string}>} - Ergebnis des Speichervorgangs.
 */
export async function savePDF(formData: FormData) {
	try {
		// Annahme: formData hat ein Feld 'file' mit der hochgeladenen PDF
		const file = formData.get('file') as unknown as File;

		if (!(file instanceof File) || !file || file.size === 0) {
			throw new Error('Keine Datei ausgewählt oder die Datei ist leer.');
		}

		// Speichern der Datei im 'public/uploads'-Verzeichnis
		const uploadsDir = path.join(process.cwd(), 'public/uploads');
		const filePath = path.join(uploadsDir, file.name);

		// Sicherstellen, dass das Verzeichnis existiert
		await mkdir(uploadsDir, { recursive: true });

		// Schreiben der Datei
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await writeFile(filePath, buffer);

		// Generieren der URL für den Zugriff auf die PDF
		const pdfUrl = `/uploads/${file.name}`;
		return { message: 'Datei erfolgreich hochgeladen.', pdfUrl };
	} catch (error) {
		console.error('Fehler beim Speichern der PDF:', error);
		return { message: 'Fehler beim Speichern der Datei.' };
	}
}
