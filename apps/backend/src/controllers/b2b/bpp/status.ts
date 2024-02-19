import { Request, Response } from "express";
import {
	onStatusBPPPayment,
	onStatusBPPPaymentError,
	onStatusDelivered,
	onStatusOutForDelivery,
	onStatusPickedUp,
	onStatusProformaInvoice,
	onStatusSelfPickedUp,
} from "../../../lib/examples";

import { ACTIONS, responseBuilder } from "../../../lib/utils";

export const statusController = (req: Request, res: Response) => {
	const { scenario } = req.query
	switch (scenario) {
		case 'delivered':
			statusDeliveredController(req, res)
			break;
		case 'out-for-delivery':
			statusOutForDeliveryController(req, res)
			break;
		case 'picked-up':
			statusPickedUpController(req, res)
			break;
		case 'proforma-invoice':
			statusProformaInvoiceController(req, res)
			break;
		case 'bpp-payment-error':
			statusProformaInvoiceController(req, res)
			break;
		case 'bpp-payment':
			statusProformaInvoiceController(req, res)
			break;
		case 'self-picked-up':
			statusProformaInvoiceController(req, res)
			break;
		default:
			res.status(404).json({
				message: {
					ack: {
						status: "NACK",
					},
				},
				error: {
					message: "Invalid scenario",
				},
			});
			break;
	}
}

export const statusDeliveredController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusDelivered.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusOutForDeliveryController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusOutForDelivery.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusPickedUpController = (req: Request, res: Response) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusPickedUp.message,
		req.body.context.bap_uri,
		`on_${ACTIONS.status}`
	);
};

export const statusProformaInvoiceController = (
	req: Request,
	res: Response
) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusProformaInvoice.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.status}`,
		`on_${ACTIONS.status}`
	);
};

export const statusBPPpaymentErrorController = (
	req: Request,
	res: Response
) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusBPPPaymentError.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.status}`,
		`on_${ACTIONS.status}`
	);
};

export const statusBPPpaymentController = (
	req: Request,
	res: Response
) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusBPPPayment.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.status}`,
		`on_${ACTIONS.status}`
	);
};

export const statusSelfPickedUpController = (
	req: Request,
	res: Response
) => {
	return responseBuilder(
		res,
		req.body.context,
		onStatusSelfPickedUp.message,
		`${req.body.context.bap_uri}/on_${ACTIONS.status}`,
		`on_${ACTIONS.status}`
	);
};
