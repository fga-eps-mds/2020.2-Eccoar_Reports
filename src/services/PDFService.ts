import "dotenv/config";
import aws from "aws-sdk";
import multerS3 from "multer-s3";

export default class PDFService{
    private storageType = {
        s3: multerS3({
            s3: new aws.S3(),
            bucket: process.env.AWS_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            acl: "public-read",
            key: (req: Express.Request, file: Express.Multer.File, callback: (err: any, key?: string) => void) => {
                let err: Error;
                if(file.originalname == '') err = new Error("filename is missing");
                const date = new Date();
                const fileName = `${date.toISOString()}-${file.originalname}`
                callback(err, fileName);   
            }
        }),
    }

    uploadPDF = {
        storage: this.storageType["s3"],
        limits: {
            fileSize: 30 * 1024 * 1024,
        },
        fileFilter: (req: Express.Request, file: Express.Multer.File, callback: any): void => {
            const allowedMimes = [
                "application/pdf"
            ]

            if (allowedMimes.includes(file.mimetype)) {
                callback(null, true);
            } else {
                callback(new Error("Invalid file type"))
            }

        }
    }
} 

