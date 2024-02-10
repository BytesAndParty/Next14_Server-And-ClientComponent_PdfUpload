import Link from 'next/link';

export default function Home() {
	return (
		<div className='gap-4 flex flex-col items-center m-4 justify-center h-screen'>
			<h1>Upload PDF</h1>
			<div className='flex flex-row gap-3'>
				<Link className='border p-2' href='/client'>
					Client Component
				</Link>
				<Link className='border p-2' href='/server'>
					Server Component
				</Link>
			</div>
		</div>
	);
}
