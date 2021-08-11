import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as helmet from 'helmet';

const app = express();


app.use(helmet());
app.use(compression())
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: express.Request, res: express.Response) => {
    res.send({
      testMensaje: 'jola',
    });
});

export default app;