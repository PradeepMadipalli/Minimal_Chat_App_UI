export class userrs {
    userId: string;
    userName: string;
    userEmail: string;
}
export class Sendmessages {
    ReceiverId: string;
    Content: string;
    SenderId: string;
}
export class ConversationHistoryRequest {
    UserId: string;
    Before: Date;
    Count: number;
    Sort: string;
}
export class EditMessageRequest {
    Messageid: string;
    Content: string;
}
export class repMessage {

    MessageId: string;

    SenderId: string;
    ReceiverId: string;
    Content: string
    Timestamp: Date;
}