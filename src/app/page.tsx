'use client';

import { useState } from 'react';
import { savePDF } from './saveData';

export default function Home() {
	const [file, setFile] = useState<File>();

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!file) return;

		try {
			const data = new FormData();
			data.append('file', file);
		} catch (e: any) {}

		const response = await savePDF(file);
	};

	return (
		<div className='flex flex-col'>
			<h1>Upload PDF to Server Test</h1>
			<form onSubmit={onSubmit}>
				<input
					type='file'
					name='file'
					accept='application/pdf'
					onChange={(e) => setFile(e.target.files?.[0])}
				/>
				<button type='submit'>Upload</button>
			</form>
			<div className='flex'>{file?.name} </div>
		</div>
	);
}
