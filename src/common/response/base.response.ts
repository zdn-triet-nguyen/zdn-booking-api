export class BaseResponse<T> {
  data: any | any[] | null;
  message: string;
  statusCode: number;
  timestamp: string;
  totalPage?: number;

  constructor(
    data: T[] | T | null,
    message: string,
    statusCode: number,
    timestamp: string,
    totalPage?: number,
  ) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = timestamp;
    this.totalPage = totalPage;
  }
}
