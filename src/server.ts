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

// hover to check the interface for Request object
// Request<Params, ResBody, ReqBody, ReqQuery>
const createMessage = (req: Request<{ channelId: string }, unknown, any>, res: Response) => {
    // the channelId will be stored inside req.params
    // this Id will be checked inside database, if don't exist then return 404
    const channelId = req.params.channelId;
    
    // returns undefined if nothing is found, undefined is falsy
    if( channels.find(channel => channel.id === channelId) === undefined ) {
        res.status(404).send({ error: 'Channel not found' });

        // response sent, stop here
        return;
    }

    // the POST content will be stored inside req.body
    const message = req.body;

    // filter for the message
    // ideal: { "body" : "message_here" }
    // bad input:  "", "   ", undefined, null, 0
    // except for "   ", everything else is falsy

    // check if it's a string
    if ( typeof message.body !== 'string' ) {
        res.status(400).send({ error: 'message must be a string.' });

        // response sent, stop here
        return;
    }
    // it's a string already so just one more filter for case of "   "
    else if (!message.body.trim()) {
        res.status(400).send({ error: 'message body must be a non-empty string' });

        // response sent, stop here
        return;
    }

    // if everything is fine. 201 is 200 but with a resource (message) created
    res.status(201).json({ 'messageSent': true });
};

// the colon is to specify that sth is a parameter in the (POST) request: req.params
app.post('/channels/:channelId/messages', createMessage);
