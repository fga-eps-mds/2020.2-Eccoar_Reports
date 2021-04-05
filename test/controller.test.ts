jest.useFakeTimers("modern");

import { ControllerReport } from '../src/controllers/ControllerReport';
import { Request, Response } from 'express';
import { ParserComplaints } from '../src/utils/ParserComplaints';
import { ParsedComplaint } from '../src/utils/ParsedComplaint';

const mockResponse = () => {
    const res: Response = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockReport = {
    complaints: [{
        "name": "Ibuprofen",
        "date": "10/25/2020",
        "description": "1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1",
        "picture": null
      }, {
        "name": "Terazosin Hydrochloride",
        "date": "9/26/2020",
        "description": "15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV",
        "picture": null
      }, {
        "name": "ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20",
        "date": "9/6/2020",
        "description": "16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm",
        "picture": null
      }
    ],
    height: 870
} as ParsedComplaint

describe("pong", () => {

    test("should return ping-pong for pong()", async () => {
        const controller = new ControllerReport();
        const mReq = {} as Request;
        const mResp = mockResponse();
        await controller.pong(mReq, mResp);
        expect(mResp.status).toHaveBeenCalledWith(200);
        expect(mResp.json).toHaveBeenCalledWith({ping: "pong"});
    });
});

describe("Report creation", () => {
    test("should create pdf", async () => {
        const controller = new ControllerReport();
        const mReq = {} as Request;
        mReq.body = {
            category: "Hole",
            complaints: [{
              "name": "Ibuprofen",
              "date": "10/25/2020",
              "description": "1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1",
              "picture": null
            }, {
              "name": "Terazosin Hydrochloride",
              "date": "9/26/2020",
              "description": "15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV",
              "picture": null
            }, {
              "name": "ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20",
              "date": "9/6/2020",
              "description": "16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm",
              "picture": null
            }
          ]
        };
        const mResp = mockResponse();
        jest.spyOn(ParserComplaints.prototype, 'convertImageToBase64').mockImplementation(() => Promise.resolve(mockReport));
        await controller.createReport(mReq, mResp);
        expect(mResp.status).toHaveBeenCalledWith(201);
        expect(mResp.json).toHaveBeenCalledWith({"msg": `Report created at src/Hole.pdf`});
    });

    test("should fail due to lack of specified category", async () => {
        const controller = new ControllerReport();
        const mReq = {} as Request;
        const mResp = mockResponse();
        await controller.createReport(mReq, mResp);
        expect(mResp.status).toHaveBeenCalledWith(400);
    });
});