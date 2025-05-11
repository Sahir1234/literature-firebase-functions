import { GameActionResult } from "./GameActionResult";

export class BackendResponse {

  private succeeded: boolean;
  private message: string;

  private constructor(succeeded: boolean, message: string) {
      this.succeeded = succeeded;
      this.message = message;
  }

  public static createResponseFor(result: GameActionResult): BackendResponse {
    if (result.isSuccess()) {
      return this.successfulResponse(result.getMessage());
    } else {
      return this.failedResponse(result.getMessage());
    }
  }

  public toJSON(): object {
      return {
          succeeded: this.succeeded,
          message: this.message
      };
  }

    public static successfulResponse(message: string): BackendResponse {
      return new BackendResponse(true, message);
  }

  public static failedResponse(message: string): BackendResponse {
      return new BackendResponse(false, message);
  }
}
