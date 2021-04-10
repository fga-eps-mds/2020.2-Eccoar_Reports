import 'dotenv/config';
import { ReadStream } from 'fs';
import { create as createPDF, CreateOptions } from 'html-pdf';

export class PDFService {
	public createPDF(
		html: string,
		pdfHeight: number,
		callbackAws: (stream: ReadStream) => void,
	): void {
		const options: CreateOptions = {
			height: `${pdfHeight + 290}px`,
			width: '900px',
		};

		return createPDF(html, options).toStream(async (err, stream) => {
			if (err) {
				return err;
			}
			callbackAws(stream);
		});
	}
}
