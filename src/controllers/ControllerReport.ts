import { Request, Response } from 'express';
import {
	compile as compileHTML,
	registerHelper as hbRegisterHelper,
} from 'handlebars';
import { readFileSync } from 'graceful-fs';
import { ParserComplaints } from '@utils/ParserComplaints';
import { PDFService } from 'src/services/PDFService';
import { S3Service } from 'src/services/S3Service';

export class ControllerReport {

    s3Service: S3Service;
    pdfService: PDFService;
    constructor(){
        this.s3Service = new S3Service();
        this.pdfService = new PDFService();
    }

	async pong(req: Request, resp: Response): Promise<void> {
		const pingPong = {
			ping: 'pong',
		};
		resp.status(200).json(pingPong);
	}

	async createReport(req: Request, resp: Response): Promise<void> {
		try {
			if (req.body === undefined || req.body === null) {
				throw new Error('Unable to generate empty report.');
			}

			hbRegisterHelper('exists', (value) => {
				return value !== null;
			});

			const img = readFileSync('src/assets/logo.png').toString('base64');
			const reportTemplate = readFileSync(
				'src/templates/report.handlebars',
				'utf-8',
			);
			const data = { ...req.body, img: `data:image/png;base64,${img}` };
			const htmlDelegate = compileHTML(reportTemplate);

			const parserComplaints = new ParserComplaints();
			const parsedComplaints = await parserComplaints.convertImageToBase64(
				data.complaints,
			);
			data.complaints = parsedComplaints.complaints;
			const height = parsedComplaints.height;

            const html = htmlDelegate(data);
        
            this.pdfService.createPDF(html, height, async (stream) => {
                const url = await this.s3Service.uploadPDF(req.body.category, stream);
                resp.status(201).json({ 
                    "reportName": url.Key,
                    "category": req.body.category,
                    "location": url.Location
                });
            });
        } catch(err) {
            resp.status(400).json({"msg": err.message});
        }
    }
}
