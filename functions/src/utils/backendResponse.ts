
export interface BackendResponse {
  succeeded: boolean;
  message: string;
}

export const successfulResponse = (message: string): BackendResponse => {
  return {
    succeeded: true,
    message: message
  };
}

export const failedResponse = (message: string): BackendResponse => {
  return {
    succeeded: false,
    message: message
  };
}
