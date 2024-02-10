// pages/api/upload.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import multer from 'multer';

interface RequestWithFile extends NextApiRequest {
	file: Express.Multer.File;
}

// Konfiguration für Multer
const upload = multer({ dest: 'public/uploads/' });

const handler = nextConnect<RequestWithFile, NextApiResponse>({
	onError(error, req, res) {
		res
			.status(500)
			.json({ error: `Etwas ist schief gelaufen: ${error.message}` });
	},
	onNoMatch(req, res) {
		res
			.status(405)
			.json({ error: `Methode '${req.method}' ist nicht erlaubt.` });
	},
});

handler.use(upload.single('pdf'));

handler.post((req, res) => {
	if (req.file) {
		res
			.status(200)
			.json({ message: 'PDF erfolgreich hochgeladen', path: req.file.path });
	} else {
		res.status(400).json({ error: 'Keine Datei hochgeladen.' });
	}
});

export default handler;

export const config = {
	api: {
		bodyParser: false,
	},
};
