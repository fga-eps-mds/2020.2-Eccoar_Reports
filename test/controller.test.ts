import { ControllerReport } from '@controllers/ControllerReport';
import { NextFunction, Request, Response } from 'express';

const mockResponse = () => {
	const res: Response = {} as Response;
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	return res;
};

jest.mock('html-pdf', () => ({
	...jest.requireActual('html-pdf'),
	create: jest.fn(),
}));

describe('pong', () => {
	test('should return ping-pong for pong()', async () => {
		const controller = new ControllerReport();
		const mReq = {} as Request;
		const mResp = mockResponse();
		await controller.pong(mReq, mResp);
		expect(mResp.status).toHaveBeenCalledWith(200);
		expect(mResp.json).toHaveBeenCalledWith({ ping: 'pong' });
	});
});

describe('Report creation', () => {
	test('should create pdf', async () => {
		const controller = new ControllerReport();
		const mReq = {} as Request;
		mReq.body = {
			category: 'Hole',
			complaints: [
				{
					name: 'Ibuprofen',
					date: '10/25/2020',
					description: '1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1',
					picture: null,
				},
				{
					name: 'Terazosin Hydrochloride',
					date: '9/26/2020',
					description: '15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV',
					picture: null,
				},
				{
					name: 'ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20',
					date: '9/6/2020',
					description: '16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm',
					picture: null,
				},
			],
		};
		const mResp = mockResponse();

		const mNext = jest.fn();
		await controller.createReport(mReq, mResp, mNext);
		expect(mNext).toHaveBeenCalled();
	});

	test('should fail due to lack of specified category', async () => {
		const controller = new ControllerReport();
		const mReq = {} as Request;
		const mResp = mockResponse();
		const mNext = () => {
			mResp.status(400).json({
				status: 'error',
				message: 'Unable to generate empty report.',
			});
		};
		await controller.createReport(mReq, mResp, mNext as NextFunction);
		expect(mResp.status).toHaveBeenCalledWith(400);
	});
});
