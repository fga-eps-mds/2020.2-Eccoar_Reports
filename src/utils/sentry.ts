import * as Sentry from '@sentry/node';
import * as express from 'express';

export const reqHandler = Sentry.Handlers.requestHandler() as express.RequestHandler;
export const traceHandler = Sentry.Handlers.tracingHandler();
export const errHandler = Sentry.Handlers.errorHandler() as express.ErrorRequestHandler;
