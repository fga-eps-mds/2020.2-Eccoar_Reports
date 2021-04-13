import 'dotenv/config';
import { S3 } from 'aws-sdk';
import { ReadStream } from 'fs';

export class S3Service {
	private readonly s3: S3;
	private readonly bucket: string;

	constructor() {
		this.s3 = new S3();
		this.bucket = process.env.AWS_BUCKET_NAME;
	}

	public async uploadPDF(
		name: string,
		stream: ReadStream,
	): Promise<S3.ManagedUpload.SendData> {
		const date = new Date();
		const params = {
			Key: `${date.getMonth()}-${date.getFullYear()}-${name}`,
			Body: stream,
			Bucket: this.bucket,
			ContentType: 'application/pdf',
			ACL: 'public-read',
		};

		const upload = this.s3.upload(params).promise();
		return upload;
	}
}
