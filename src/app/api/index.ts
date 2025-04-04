const response = {
  send: <T = any>(data: T, props?: ResponseOptions) =>
    Response.json(data, props),
  error: <T = string>(message: T, props?: ResponseOptions) =>
    Response.json(message, {
      ...props,
      status: props?.status ?? 500,
      statusText:
        props?.statusText ?? (typeof message === "string" ? message : "Error"),
      headers: {},
    }),
};

export interface ResponseOptions {
  status?: number;
  statusText?: string;
}
export default response;

response.send<{ message: string }>({ message: "message" });
response.error<{ message: string }>({ message: "message" });
