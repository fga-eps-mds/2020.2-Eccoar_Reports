import * as express from 'express';
import routers from './routes';
import * as cors from 'cors';
import * as morgan from "morgan";

const app = express();
const PORT = process.env.APP_PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(morgan('combined'));
app.use(routers);
app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
