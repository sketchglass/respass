export
enum ReceiveEventType {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  JOIN,
  PONG,
  LEFT,
}

export
enum SendEventType {
  NEW_MESSAGE,
  DELETE_MESSAGE,
  USER_JOIN,
  USER_LEAVE,
  PING,
}
