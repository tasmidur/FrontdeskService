// common-response.model.ts
export class CommonResponse<T> {
  success: boolean;
  message: string;
  status: string;
  data: T;

  Result: string;

  constructor(
    success: boolean,
    message: string,
    status: string,
    data: T = null,
  ) {
    this.success = success;
    this.message = message;
    this.status = status;
    this.data = data;

    this.Result = message;
  }
}
