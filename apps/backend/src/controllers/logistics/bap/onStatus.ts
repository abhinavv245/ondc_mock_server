import { NextFunction, Request, Response } from "express";

export const onStatusController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {

		res.status(200).json({
			sync: {
				message: {
					ack: {
						status: "ACK",
					},
				},
			},
			async: {},
		});
		return;
	
};
