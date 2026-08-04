import express from 'express';
import type {Express, Request, Response} from 'express'

const app: Express = express();
const port = 3000;

app.listen(port, (): void => {
    console.log(`Listening at port ${port}`);
})

app.get('/health', (req: Request, res: Response) => {
    res.send({ "status": "ok" });
});
