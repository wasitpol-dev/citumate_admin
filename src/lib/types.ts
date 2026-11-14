export type RoomStatus = "open" | "maintenance";

export type Room = {
  id: string;
  name: string;
  type: string;
  location: string;
  capacity: string;
  capMin: number;
  capMax: number;
  status: RoomStatus;
  image: string;
};

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled";

export type Booking = {
  id: number;
  roomId: string;
  roomName: string;
  roomType: string;
  dateKey: string;
  dateLabel: string;
  slot: string;
  attendees: number;
  purpose: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  status: BookingStatus;
  createdAt: string;
};

export type HourlyStat = {
  time: string;
  studyRoom: number;
  meetingRoom: number;
};
