import { mkdir, writeFile } from "fs/promises";
import Link from "next/link";
import { join } from "path";
import pdf from "pdf-parse";
import { PdfReader } from "pdfreader";

const ServerPage = () => {
	async function upload(data: FormData) {
		"use server";

		const file: File = data.get("file") as unknown as File;

		if (!file) {
			throw new Error("Keine Datei ausgewählt oder die Datei ist leer.");
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		const uploadsDir = join(process.cwd(), "public/uploads");
		const path = join(uploadsDir, file.name);

		// Sicherstellen, dass das Verzeichnis existiert
		await mkdir(uploadsDir, { recursive: true });

		await writeFile(path, buffer);

		// Verwendung von pdf-parse, um den Text aus der PDF-Datei zu extrahieren
		try {
			let extractedText = "";
			await new Promise<void>((resolve, reject) => {
				new PdfReader({}).parseBuffer(buffer, (err, item) => {
					if (err) {
						reject(err);
					} else if (!item) {
						resolve();
					} else if (item.text) {
						extractedText += item.text + " ";
					}
				});
			});

			if (extractedText.trim().length > 0) {
				throw new Error("Die PDF enthält keinen lesbaren Text.");
			}

			const pdfUrl = `/uploads/${file.name}`;

			return {
				success: true,
				message: "Datei erfolgreich hochgeladen und Text extrahiert.",
				pdfUrl,
				text: extractedText,
			};
		} catch (error: any) {
			console.error("Fehler beim Parsen der PDF:", error);
			throw new Error("Fehler beim Parsen der PDF: " + error?.message);
		}
	}

	return (
		<div className="items-center flex flex-col">
			<h1 className="text-2xl m-4 ">Upload PDF via Server Component</h1>
			<Link href="/client">
				go back to{" "}
				<span className="text-blue-500">Client Component</span>
			</Link>
			<form action={upload} className="mt-20 flex flex-col">
				<input
					className="m-4"
					type="file"
					name="file"
					accept="application/pdf"
				/>
				<button
					className="m-4 boroder bg-gray-700 rounded"
					type="submit"
				>
					Upload
				</button>
			</form>
		</div>
	);
};

export default ServerPage;
