import { PdfReader } from "pdfreader";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: NextRequest) {
	const data = await req.formData();
	const file: File | null = data.get("file") as unknown as File;

	if (!file) {
		return NextResponse.json({ success: false });
	}

	// Converting web PDF to bytes that Node.js can understand
	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	const uploadsDir = join(process.cwd(), "public/uploads");
	const path = join(uploadsDir, file.name);

	// Ensure the directory exists
	await mkdir(uploadsDir, { recursive: true });

	await writeFile(path, buffer);

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
			return NextResponse.json({ success: true, text: extractedText });
		}

		return NextResponse.json({
			success: false,
			message: "Kein Text in der PDF gefunden.",
		});
	} catch (error) {
		console.error("Fehler beim Parsen der PDF:", error);
		return NextResponse.json({
			success: false,
			message: "Fehler beim Parsen der PDF",
		});
	}
}
