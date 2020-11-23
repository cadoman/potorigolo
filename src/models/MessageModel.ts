interface MessageModel{
  sender_name: string,
  timestamp_ms: number
  type: string
  content?: string
  photos?: {
    uri : string
  }[],
  reactions?: {
    reaction : string,
    actor : string
  }[]
}

export default MessageModel;
