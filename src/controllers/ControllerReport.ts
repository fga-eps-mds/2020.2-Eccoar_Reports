import { Request, Response } from "express";
import handlebars from 'handlebars';
import { create as createPDF, FileInfo } from 'html-pdf';
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
            let missingFields:string[] = [];
            const categories = {'Hole': 'Buraco', 'Energy': 'Eletricidade', 'Water': 'Água'};
            const fields = ['title', 'date', 'votes', 'description', 'category'];
            fields.forEach(field => {
                if(!(field in req.body)) missingFields.push(field);
            });
            if(missingFields.length > 0) resp.status(400).json({"msg": `Missing fields [${missingFields}]`})

            const reportTemplate = readFileSync('src/templates/report.handlebars', 'utf-8');

            let data = req.body;
            data['category'] = categories[data['category']];
            const htmlDelegate = handlebars.compile(reportTemplate);
            const html = htmlDelegate(data);
            
            const options = {};

            /* create(html, options).toStream((err, pdfStream) => {
                if(err) {
                    return resp.status(400).json({"message": err});
                } else {
                    resp.statusCode = 201;
                    pdfStream.on('end', () => {
                        return resp.end();
                    });

                    pdfStream.pipe(resp);
                }
            }); */
            createPDF(html, options).toStream((err, stream) => {
                if(err) return resp.status(400).json({"message": err});

                stream.pipe(createWriteStream('./file.pdf'));

                return resp.status(201).json({"message": "File created at ./report.pdf"});
            });
        } catch(err) {
            console.error(err);
            resp.status(400).json({'msg': err});
        }
    }
}