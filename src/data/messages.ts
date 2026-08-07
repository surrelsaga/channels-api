export interface Message {
    channelId: string
    msg: { body: string }
}

export const messages: Message[] = [];
