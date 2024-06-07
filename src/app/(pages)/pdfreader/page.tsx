"use client";

import Link from "next/link";
import { useState } from "react";

const ClientPage = () => {
	const [file, setFile] = useState<File>();
	const [uploadResult, setUploadResult] = useState<{
		success: boolean;
		text?: string;
		message?: string;
	} | null>(null);

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!file) {
			console.error("No file selected or file is empty");
			return;
		}

		try {
			const data = new FormData();
			data.set("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: data,
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const result = await response.json();
			setUploadResult(result);

			console.log("success: " + result.success);
			if (result.text) {
				console.log("text: " + result.text);
			} else if (result.message) {
				console.log("message: " + result.message);
			}
		} catch (error: any) {
			console.error(error);
			setUploadResult({ success: false, message: error.message });
		}
	};

	return (
		<div className="items-center flex flex-col">
			<h1 className="text-2xl m-4 ">Upload PDF via Client Component</h1>
			<Link href="/server">
				go back to{" "}
				<span className="text-blue-500">Server Component</span>
			</Link>
			<form onSubmit={onSubmit} className="mt-20 flex flex-col">
				<input
					className="m-4"
					type="file"
					name="file"
					accept="application/pdf"
					onChange={(event) => {
						setFile(event.target.files?.[0]);
					}}
				/>
				<button
					className="m-4 border bg-gray-700 rounded"
					type="submit"
				>
					Upload
				</button>
			</form>
			{uploadResult && (
				<div className="mt-4 p-2 border rounded bg-gray-100">
					{uploadResult.success ? (
						<pre>{uploadResult.text}</pre>
					) : (
						<p>{uploadResult.message}</p>
					)}
				</div>
			)}
		</div>
	);
};

export default ClientPage;
