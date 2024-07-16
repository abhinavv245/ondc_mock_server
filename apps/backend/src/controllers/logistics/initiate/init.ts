import { NextFunction, Request, Response } from "express";
import {
	LOGISTICS_BAP_MOCKSERVER_URL,
	LOGISTICS_EXAMPLES_PATH,
	MOCKSERVER_ID,
	send_response,
	redis,
	send_nack,
	Item,
} from "../../../lib/utils";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";

export const initiateInitController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
		const transactionKeys = await redis.keys(`${transactionId}-*`);
		const ifTransactionExist = transactionKeys.filter((e) =>
			e.includes("on_search-from-server")
		);
		if (ifTransactionExist.length === 0) {
			return send_nack(res, "On Search doesn't exist");
		}
		const transaction = await redis.mget(ifTransactionExist);
		const parsedTransaction = transaction.map((ele) => {
			return JSON.parse(ele as string);
		});

		const request = parsedTransaction[0].request;
		if (Object.keys(request).includes("error")) {
			return send_nack(res, "On Search had errors");
		}
		// console.log(request);
		let bpp_uri = request.context.bpp_uri;
		let city = request.context.location.city.code;
		let domain = request.context.domain;
		let init;
		const providers = request.message.catalog.providers;
		const items: Item[] = providers[0].items;

		function getRandomItem<T>(array: T[]): T | undefined {
			if (array.length === 0) return undefined;
			const randomIndex = Math.floor(Math.random() * array.length);
			return array[randomIndex];
		}

		let randomItem = getRandomItem(items);
		if (!randomItem) {
			return send_nack(res, "No items available.");
		}

		init = {
			context: {
				...request.context,
				action: "init",
				bpp_id: MOCKSERVER_ID,
				timestamp: new Date().toISOString(),
				message_id: uuidv4(),
			},
			message: {
				order: {
					provider: {
						id: providers[0].id,
						locations: providers[0].locations,
					},
					items: [
						{
							id: randomItem.id,
							category_ids: randomItem.category_ids,
							fulfillment_ids: randomItem.fulfillment_ids,
							descriptor: {
								code: randomItem.descriptor?.code,
							},
						},
					],
					fulfillments: [
						{
							id: "1",
							type: "Delivery",
							stops: [
								{
									type: "start",
									location: {
										gps: "12.4535445,77.9283792",
										address: "My building #, My street name",
										city: {
											name: "Bengaluru",
										},
										state: {
											name: "Karnataka",
										},
										country: {
											code: "IND",
										},
										area_code: "560041",
									},
									contact: {
										phone: "9886098860",
										email: "abcd.efgh@gmail.com",
									},
								},
								{
									type: "end",
									location: {
										gps: "12.342769,77.9129423",
										area_code: "560043",
										address: "My house or building name, street name",
										city: {
											name: "Bengaluru",
										},
										state: {
											name: "Karnataka",
										},
										country: {
											code: "IND",
										},
									},
									contact: {
										phone: "9886098860",
										email: "abcd.efgh@gmail.com",
									},
								},
							],
						},
					],
					billing: {
						name: "ONDC sellerapp",
						address: "My house or building name",
						city: "Bengaluru",
						state: "Karnataka",
						tax_id: "XXXXXXXXXXXXXXX",
						phone: "9886098860",
						email: "abcd.efgh@gmail.com",
						time: {
							timestamp: "2023-10-17T21:11:00.000Z",
						},
					},
					payments: {
						collected_by: "BPP",
						type: "ON-FULFILLMENT",
						tags: [
							{
								descriptor: {
									code: "Settlement_Details",
								},
								list: [
									{
										descriptor: {
											code: "Counterparty",
										},
										value: "BAP",
									},
									{
										descriptor: {
											code: "Mode",
										},
										value: "UPI",
									},
									{
										descriptor: {
											code: "Beneficiary_Name",
										},
										value: "xxxxx",
									},
									{
										descriptor: {
											code: "Bank_Account_No",
										},
										value: "xxxxx",
									},
									{
										descriptor: {
											code: "Ifsc_Code",
										},
										value: "xxxxxxx",
									},
									{
										descriptor: {
											code: "UPI_Address",
										},
										value: "xxxxxxx",
									},
								],
							},
							{
								descriptor: {
									code: "Collection_Details",
								},
								list: [
									{
										descriptor: {
											code: "Amount",
										},
										value: "20000",
									},
									{
										descriptor: {
											code: "Type",
										},
										value: "ON-FULFILLMENT",
									},
								],
							},
						],
					},
					xinput: {
						form: {
							url: "https://lsp.com/xxx/kyc",
							mime_type: "text/html",
							submission_id: "xxxx44567789999",
						},
						required: true,
					},
				},
			},
		};
		await send_response(res, next, init, transactionId, "init");
	} catch (error) {
		return next(error);
	}
};