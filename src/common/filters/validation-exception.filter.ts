import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common";
import { CommonResponse } from "../response-model/common-response.model";

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const validationError = exception.getResponse()["error"];
    const exceptionStatusCode = exception.getResponse()["statusCode"];
    console.log("ValidationExceptionFilter", validationError, exception.stack);
    // Format the validation error response
    const responseBody = new CommonResponse(
      false,
      "Fail : Input Validation",
      exceptionStatusCode,
      validationError
    );

    response.status(exceptionStatusCode).json({ responseBody });
  }
}
