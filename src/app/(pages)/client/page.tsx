'use client';

import Link from 'next/link';
import { useState } from 'react';

const ServerPage = () => {
	const [file, setFile] = useState<File>();

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!file) {
			console.error('No file selected or file is empty');
			return;
		}

		try {
			const data = new FormData();
			data.set('file', file);

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: data,
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	return (
		<div className='items-center flex flex-col'>
			<h1 className='text-2xl m-4 '>Upload PDF via Client Component</h1>
			<Link href='/server'>
				go back to <span className='text-blue-500'>Server Component</span>
			</Link>
			<form onSubmit={onSubmit} className='mt-20 flex flex-col'>
				<input
					className='m-4'
					type='file'
					name='file'
					accept='application/pdf'
					onChange={(event) => {
						setFile(event.target.files?.[0]);
					}}
				/>
				<button className='m-4 boroder bg-gray-700 rounded' type='submit'>
					Upload
				</button>
			</form>
		</div>
	);
};

export default ServerPage;
