import { Request, Response } from "express";
import {compile as compileHTML, registerHelper as hbRegisterHelper} from 'handlebars';
import { create as createPDF, CreateOptions } from 'html-pdf';
import {readFileSync, createWriteStream} from 'graceful-fs';
import * as imageToBase64 from 'image-to-base64';

export class ControllerReport {
    async pong (req: Request, resp: Response): Promise<void> {
        const pingPong = {
            ping: "pong"
        }
        resp.status(200).json(pingPong);
    }

    async convertImageToBase64(complaints: any) {
        let height = 0;
        let base64Resolve = [];
        for(let i = 0; i < complaints.length; i++) {
            if(complaints[i].image !== null) {
                base64Resolve.push(imageToBase64(complaints[i].image));
                height+=500;
            }
            else {
                height+=290;
            }
        }
        await Promise.all(base64Resolve);
        for(let i = 0; i < complaints.length; i++) {
            if(complaints[i].image !== null) {
                complaints[i].image = base64Resolve.shift();
                height+=500;
            }
            else {
                height+=290;
            }
        }
        return complaints;
    }

    async createReport(req: Request, resp: Response): Promise<void>{
        try {

            hbRegisterHelper('exists', (value) => {
                return value !== null;
            });

            const img = readFileSync('src/assets/logo.png').toString('base64');
            const reportTemplate = readFileSync('src/templates/report.handlebars', 'utf-8');
            let data = {...req.body, img: `data:image/png;base64,${img}`};
            const htmlDelegate = compileHTML(reportTemplate);
            
            let height = 0;
            data.complaints = await this.convertImageToBase64(data.complaints);
            console.log(data.complaints);
            const html = htmlDelegate(data);
            const options: CreateOptions = {
                height: `${height + 250}px`,
                width: '900px'
            };
            createPDF(html, options).toStream((err, stream) => {
                if(err) return resp.status(400).json({"message": err});
                stream.pipe(createWriteStream(`src/${req.body.category}.pdf`));
            });

            resp.status(201).json({"msg": `Report created at src/${req.body.category}.pdf`});
        } catch(err) {
            resp.status(400).json({'msg': err.message});
        }
    }
}