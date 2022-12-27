export const createChatroomValidationSchema = {
    chatRoomId: { type: 'string', optional: true },
    ownerId: { type: 'string', optional: true },
    dealId: { type: 'string' },
    isDeleted: { type: 'boolean', optional: true },
    isArchived: { type: 'boolean', optional: true },
    chattersId: { type: "array", items: "string", optional: true },
    $$strict: true,

}
export const getDealChatroomValidationSchema = {
    ownerId: { type: 'string' },
    dealId: { type: 'string' },
    $$strict: true,
}
export const sendMessageInChatroomValidationSchema = {
    id: { type: 'string', optional: true },
    replyTo: { type: 'string', optional: true },
    message: { type: 'string' },
    chatRoomId: { type: 'string' },
    $$strict: true,
}
