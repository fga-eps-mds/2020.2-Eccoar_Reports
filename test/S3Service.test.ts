import { S3Service } from '../src/services/S3Service';

const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn()
}

jest.mock('aws-sdk', () => {
    return {S3: jest.fn(() => mockS3Instance)};
})

describe("S3 Upload", () => {

    test("Should upload to bucket", async () => {
        mockS3Instance.promise.mockResolvedValueOnce('mockResponse');
        const s3 = new S3Service();
        const result = await s3.uploadPDF('Hole', null);
        expect(result).toBe('mockResponse');
    });
});