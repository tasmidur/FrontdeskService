export interface IGuestInfoParams {
  roomNumber?: string;
  extensionNumber?: string;
}

export interface IGuestInfoResponse {
  guestName: string;
  guestStatus: string;
  propertyName: string;
  roomNumber: string;
  extensionNumber: string;
}
