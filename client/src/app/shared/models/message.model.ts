export interface MessageModel {
  senderId: string,
  receiverId: string,
  message?: string,
  hasFile?: boolean,
  fileExt?: string,
  fileName?: string,
  file?: any,
  sendDate?: Date,
  readed?: boolean
}
