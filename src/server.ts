import * as express from 'express';
import routers from './routes';
import * as cors from 'cors';
import * as morgan from 'morgan';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import handleErrors from '@utils/ErrorHadler';

const app = express();
const PORT = process.env.APP_PORT || 5000;
const DSN =
	process.env.APP_DSN ||
	'https://d963df56f6dc4879a92cbdfd113f7fcf@o570893.ingest.sentry.io/5718329';

Sentry.init({
	dsn: `${DSN}`,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
		new Tracing.Integrations.Mysql(),
	],

	tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));

app.use(routers);

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

app.use(handleErrors);
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
