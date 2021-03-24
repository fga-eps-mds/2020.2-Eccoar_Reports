import { Request, Response } from "express";
import handlebars from 'handlebars';

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

            const template = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>{{title}}</title>
                </head>
                <body>
                    <h1>{{title}}</h1>
                    <h3>Denúncia criada em {{date}}</h3>
                    <h3>{{votes}} pessoas reportaram esse problema</h3>
                    <p>{{description}}</p>
                </body>
                </html>
            `;

            const data = req.body;
            const htmlDelegate = handlebars.compile(template);
            const html = htmlDelegate(data);
            resp.send(html);
        } catch(err) {
            console.error(err);
            resp.status(400).json({'msg': err});
        }
    }
}