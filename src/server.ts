import express from 'express';
import type {Express, Request, Response} from 'express'
import crypto from 'crypto';

import { channels } from './data/channels.ts'
import type { Channel } from './data/channels.ts';

const app: Express = express();
const port = 3000;

// expression.json() middleware
app.use(express.json());

app.listen(port, (): void => {
    console.log(`Listening at port ${port}`);
})

app.get('/health', (req: Request, res: Response) => {
    res.send({ "status": "ok" });
});

app.get('/channels', (req: Request, res: Response) => {
    // reply with an array of all the channels created
    res.send(channels);
});

app.post('/channels', (req: Request, res: Response) => {
    const id = crypto.randomUUID();
    const timeCreated = new Date().toISOString();
    const name = req.body.name;

    const createdChannel: Channel = {
        name: name,
        id: id,
        createdAt: timeCreated
    };

    // update to the "database" channels: a module
    channels.push(createdChannel);

    // return with 201 status code and the object
    res.status(201).send(createdChannel);
});
