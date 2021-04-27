import * as express from 'express';
import routers from './routes';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import * as morgan from 'morgan';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import handleErrors from '@utils/ErrorHadler';
import { reqHandler, traceHandler, errHandler } from './utils/sentry';

const app = express();
const PORT = process.env.APP_PORT || 5000;

dotenv.config();
Sentry.init({
	dsn: process.env.SENTRY_DSN,
	integrations: [
		new Sentry.Integrations.Http({ tracing: true }),
		new Tracing.Integrations.Express({ app }),
		new Tracing.Integrations.Mysql(),
	],

	tracesSampleRate: 1.0,
});

app.use(reqHandler);
app.use(traceHandler);
app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(routers);
app.use(errHandler);
app.use(handleErrors);

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
