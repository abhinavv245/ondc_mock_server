import { NextFunction, Request, Response } from "express";

export const onCancelController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {


  return res.json({
    sync: {
      message: {
        ack: {
          status: "ACK",
        },
      },
    },
    async: {},
  });
};
