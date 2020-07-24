export interface MessageModel {
  senderId: string,
  receiverId: string,
  message?: string,
  hasFile?: boolean,
  filePath?: boolean,
  fileExt?: string,
  sendDate?: Date,
  readed?: boolean
}
