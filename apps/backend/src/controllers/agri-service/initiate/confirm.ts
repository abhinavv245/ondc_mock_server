import { NextFunction, Request, Response } from "express";
import {
	AGRI_SERVICES_BAP_MOCKSERVER_URL,
	MOCKSERVER_ID,
	checkIfCustomized,
	send_response,
	send_nack,
	quoteCreatorServiceCustomized,
	redisFetchToServer,
	AGRI_SERVICES_BPP_MOCKSERVER_URL,
	quoteCreatorAgriService
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";

export const initiateConfirmController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { scenario, transactionId } = req.body;
	const on_search = await redisFetchToServer("on_search", transactionId);
	const providersItems = on_search?.message?.catalog?.providers[0]?.items;
	const on_init = await redisFetchToServer("on_init", transactionId)

	if(!on_init){
		return send_nack(res,"On Init doesn't exist")
	}

	on_init.context.bpp_uri = AGRI_SERVICES_BPP_MOCKSERVER_URL
	return intializeRequest(res, next, on_init, scenario,providersItems);
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: string,
	providersItems:any
) => {
	const {
		context,
		message: {
			order: {
				provider,
				locations,
				payments,
				fulfillments,
				xinput,
				items,
			},
		},
	} = transaction;
	const { transaction_id } = context;
	const { stops, ...remainingfulfillments } = fulfillments[0];

	const timestamp = new Date().toISOString();

	const customized = checkIfCustomized(items);
	const confirm = {
		context: {
			...context,
			timestamp: new Date().toISOString(),
			action: "confirm",
			bap_id: MOCKSERVER_ID,
			bap_uri: AGRI_SERVICES_BAP_MOCKSERVER_URL,
			message_id: uuidv4()
		},
		message: {
			order: {
				...transaction.message.order,
				id: uuidv4(),
				status: "Created",
				provider: {
					...provider,
					locations,
				},
				items,
				fulfillments: [
					{
						...remainingfulfillments,
						stops: stops.map((stop: any) => {
							return {
								...stop,
								contact: {
									...stop.contact,
									email: stop.contact && stop.contact.email ? stop.contact.email : "nobody@nomail.com"
								},
								customer: {
									person: {
										name: "Ramu",
									},
								},
								tags: undefined
							};
						}),
					},
				],
				quote: customized
					? quoteCreatorServiceCustomized(items)
					: quoteCreatorAgriService(items,providersItems),
				payments: [
					{
						//hardcoded transaction_id
						...payments[0],
						params: {
							...payments[0].params,
							transaction_id: "xxxxxxxx",
						},
						status: "PAID",
					},
				],
				created_at: timestamp,
				updated_at: timestamp,
				xinput: {
					...xinput,
					form: {
						...xinput.form,
						submission_id: "xxxxxxxxxx",
						status: "SUCCESS",

					}
				},
			},
		},
	};
	// confirm.message.order.quote.breakup.forEach((itm: any) => {
	// 	itm.item.quantity = {
	// 		selected: {
	// 			count: 3
	// 		}
	// 	}
	// })
	await send_response(res, next, confirm, transaction_id, "confirm",scenario=scenario);
	// const header = await createAuthHeader(confirm);
	// try {
	// 	await redis.set(
	// 		`${transaction_id}-confirm-from-server`,
	// 		JSON.stringify({ request: confirm })
	// 	);
	// 	await axios.post(`${context.bpp_uri}/confirm?scenario=${scenario}`, confirm, {
	// 		headers: {
	// 			// "X-Gateway-Authorization": header,
	// 			authorization: header,
	// 		},
	// 	});

	// 	return res.json({
	// 		message: {
	// 			ack: {
	// 				status: "ACK",
	// 			},
	// 		},
	// 		transaction_id,
	// 	});
	// } catch (error) {
	// 	return next(error)
	// }
};