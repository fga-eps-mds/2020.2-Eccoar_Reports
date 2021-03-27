import { Request, Response } from "express";
import handlebars from 'handlebars';
import { create as createPDF, CreateOptions, FileInfo } from 'html-pdf';
import {readFileSync, createWriteStream} from 'graceful-fs';

export class ControllerReport {
    async pong (req: Request, resp: Response): Promise<void> {
        const pingPong = {
            ping: "pong"
        }
        resp.status(200).json(pingPong);
    }

    async createReport(req: Request, resp: Response): Promise<void>{
        try {


            const reportTemplate = readFileSync('src/templates/report.handlebars', 'utf-8');

            let data = req.body;
            const htmlDelegate = handlebars.compile(reportTemplate);
            const html = htmlDelegate(data);
            
            const options: CreateOptions = {};

            createPDF(html, options).toStream((err, stream) => {
                if(err) return resp.status(400).json({"message": err});

                stream.pipe(createWriteStream('./file.pdf'));

                resp.statusCode = 201;
                stream.on('end', () => {
                    resp.end();
                });
                stream.pipe(resp);
            });
        } catch(err) {
            console.error(err);
            resp.status(400).json({'msg': err});
        }
    }
}