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
        "title": "Ibuprofen",
        "date": "10/25/2020",
        "votes": 211,
        "description": "1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1",
        "image": null
      }, {
        "title": "Terazosin Hydrochloride",
        "date": "9/26/2020",
        "votes": 196,
        "description": "15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV",
        "image": null
      }, {
        "title": "ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20",
        "date": "9/6/2020",
        "votes": 425,
        "description": "16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm",
        "image": null
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
    test("should create pdf", () => {
        const controller = new ControllerReport();
        const mReq = {} as Request;
        mReq.body = {
            category: "Hole",
            complaints: [{
                "title": "Ibuprofen",
                "date": "10/25/2020",
                "votes": 211,
                "description": "1P6M2SvMCvcyHaH4Q5dHNjj2uaSC3aFqN1",
                "image": null
              }, {
                "title": "Terazosin Hydrochloride",
                "date": "9/26/2020",
                "votes": 196,
                "description": "15E1HiYEYGrTrb34TWDQpLRPMwSuvoYEKV",
                "image": null
              }, {
                "title": "ESIKA HD COLOR HIGH DEFINITION COLOR SPF 20",
                "date": "9/6/2020",
                "votes": 425,
                "description": "16QY4xHS5u69cbEwFDYwefsNevLyoaLQDm",
                "image": null
              }
            ]
        };
        const mResp = mockResponse();
        jest.spyOn(ParserComplaints.prototype, 'convertImageToBase64').mockImplementation(() => Promise.resolve(mockReport));
        controller.createReport(mReq, mResp);
        expect(mResp.json).toHaveBeenCalledWith({"msg": `Report created at src/Hole.pdf`})
        expect(mResp.status).toHaveBeenCalledWith(201);
    });

    test("should fail due to lack of specified category", () => {
        const controller = new ControllerReport();
        const mReq = {} as Request;
        const mResp = mockResponse();
        controller.createReport(mReq, mResp);
        expect(mResp.status).toHaveBeenCalledWith(400);
    });
});