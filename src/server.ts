// example code

import express from 'express';
import type {Express, Request, Response} from 'express'

const app: Express = express();
const port = 8000;

app.listen(port, (): void => {
    console.log(`Listening at port ${port}`);
})

app.get('/', (req: Request, res: Response) => {
    res.json({});
});
