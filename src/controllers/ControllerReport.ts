import { Request, Response } from "express";
import {compile as compileHTML, registerHelper as hbRegisterHelper} from 'handlebars';
import { create as createPDF, CreateOptions } from 'html-pdf';
import {readFileSync, createWriteStream} from 'graceful-fs';
import { ParserComplaints } from "../utils/ParserComplaints";
import { S3 } from "aws-sdk";

import "dotenv/config";

export class ControllerReport {
    
    private s3: S3;

    constructor(){
        this.s3 = new S3();
    }
    
    async pong (req: Request, resp: Response): Promise<void> {
        const pingPong = {
            ping: "pong"
        }
        resp.status(200).json(pingPong);
    }

    async createReport(req: Request, resp: Response): Promise<void>{
        try {
            if (req.body === undefined || req.body === null) {
                throw new Error("Unable to generate empty report.");
            }

            hbRegisterHelper('exists', (value) => {
                return value !== null;
            });

            const img = readFileSync('src/assets/logo.png').toString('base64');
            const reportTemplate = readFileSync('src/templates/report.handlebars', 'utf-8');
            const data = {...req.body, img: `data:image/png;base64,${img}`};
            const htmlDelegate = compileHTML(reportTemplate);

            const parserComplaints = new ParserComplaints();
            const parsedComplaints = await parserComplaints.convertImageToBase64(data.complaints);
            data.complaints = parsedComplaints.complaints;
            const height = parsedComplaints.height;

            const html = htmlDelegate(data);
            const options: CreateOptions = {
                height: `${height + 250}px`,
                width: '900px'
            };
            createPDF(html, options).toStream((err, stream) => {
                if(err) return resp.status(400).json({"message": err});
                const date = new Date();
                const params = {
                    Key: `${date.getMonth()}-${date.getFullYear()}-${req.body.category}`,
                    Body: stream,
                    Bucket: process.env.AWS_BUCKET_NAME,
                    ContentType: "application/pdf",
                    ACL: "public-read"
                };

                this.s3.upload(params, (err, data) => {
                    if(err){
                        console.log(err, 'err');
                        throw new Error(err.message);
                    }
                    console.log(">>>>> PDF CREATED AND UPLOADED SUCCESSFULLY");
                    
                    resp.status(201).json({ 
                        "msg": `Report created at src/${req.body.category}.pdf`,
                        "location": data.Location 
                    });
                });
            });
        } catch(err) {
            resp.status(400).json({"msg": err.message});
        }
    }
}
