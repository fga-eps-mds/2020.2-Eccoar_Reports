import { Request, Response } from "express";
import handlebars from 'handlebars';
import { create } from 'html-pdf';
import { reportTemplate } from "../templates/report";

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
            const fields = ['title', 'date', 'votes', 'description'];
            fields.forEach(field => {
                if(!(field in req.body)) missingFields.push(field);
            });
            if(missingFields.length > 0) resp.status(400).json({"msg": `Missing fields [${missingFields}]`})

            const data = req.body;
            const htmlDelegate = handlebars.compile(reportTemplate);
            const html = htmlDelegate(data);
            
            const options = {};

            create(html, options).toStream((err, pdfStream) => {
                if(err) {
                    return resp.status(400).json({"message": err});
                } else {
                    resp.statusCode = 201;
                    pdfStream.on('end', () => {
                        return resp.end();
                    });

                    pdfStream.pipe(resp);
                }
            });
        
        } catch(err) {
            console.error(err);
            resp.status(400).json({'msg': err});
        }
    }
}