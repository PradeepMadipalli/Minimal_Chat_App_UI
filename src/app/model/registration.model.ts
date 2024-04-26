export class userrs {
    userId: string;
    userName: string;
    userEmail: string;
}
export class Sendmessages {
    ReceiverId: string;
    Content: string;
    SenderId: string;
    groupId: string;
}
export class ConversationHistoryRequest {
    UserId: string;
    Before: Date;
    Count: number;
    Sort: string;
    groupId: string;
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
export class RequestGroup {
    GroupName: string;
    UserId: string;
}
export class UserList
{
     UserId :string;
     UserName:string;
}
export class AddUserList
{
     UserId :string;
     UserName:string;
     GroupId: string
     GroupName :string
}
export class Group
{
    GroupId: string
     GroupName :string
}
export class ProfilePhoto
{
    userid:string;
    PhotoPath:string;
}