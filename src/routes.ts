import { Router, Request, Response } from 'express';

import { ControllerReport } from './controllers/ControllerReport';

const routers = Router();
const controller = new ControllerReport();

routers.get("/api/ping", (req: Request, resp: Response) => {
    controller.pong(req, resp);
});

export default routers;