import { CONTEXT_DOMAIN, VERSION } from "./constants";

export const initSchema = {
	$id: "initSchema",
	type: "object",
	properties: {
		context: {
			type: "object",
			properties: {
				domain: {
					type: "string",
					enum: CONTEXT_DOMAIN,
				},
				location: {
					type: "object",
					properties: {
						city: {
							type: "object",
							properties: {
								code: {
									type: "string",
								},
							},
							required: ["code"],
						},
						country: {
							type: "object",
							properties: {
								code: {
									type: "string",
								},
							},
							required: ["code"],
						},
					},
					required: ["city", "country"],
				},
				action: {
					type: "string",
					const: "init",
				},
				version: {
					type: "string",
					const: VERSION,
				},
				bap_id: {
					type: "string",
				},
				bap_uri: {
					type: "string",
				},
				bpp_id: {
					type: "string",
				},
				bpp_uri: {
					type: "string",
				},
				transaction_id: {
					type: "string",
				},
				message_id: {
					type: "string",
				},
				timestamp: {
					type: "string",
					format: "date-time",
				},
				ttl: {
					type: "string",
				},
			},
			required: [
				"domain",
				"location",
				"action",
				"version",
				"bap_id",
				"bap_uri",
				"bpp_id",
				"bpp_uri",
				"transaction_id",
				"message_id",
				"timestamp",
				"ttl",
			],
		},
		message: {
			type: "object",
			properties: {
				order: {
					type: "object",
					properties: {
						provider: {
							type: "object",
							properties: {
								id: {
									type: "string",
								},
								locations: {
									type: "array",
									items: {
										type: "object",
										properties: {
											id: {
												type: "string",
											},
										},
										required: ["id"],
									},
								},
							},
							required: ["id", "locations"],
							additionalProperties: false,
						},
						items: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									category_ids: {
										type: "array",
										items: {
											type: "string",
										},
									},
									fulfillment_ids: {
										type: "array",
										items: {
											type: "string",
										},
									},
									descriptor: {
										type: "object",
										properties: {
											code: {
												type: "string",
												enum: ["P2H2P", "P2P"],
											},
										},
										required: ["code"],
									},
								},
								required: [
									"id",
									"category_ids",
									"fulfillment_ids",
									"descriptor",
								],
							},
						},
						fulfillments: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									type: {
										type: "string",
									},
									stops: {
										type: "array",
										items: {
											type: "object",
											properties: {
												type: {
													type: "string",
													enum: ["start", "end"],
												},
												location: {
													type: "object",
													properties: {
														gps: {
															type: "string",
														},
														address: {
															type: "string",
														},
														city: {
															type: "object",
															properties: {
																name: {
																	type: "string",
																},
															},
															required: ["name"],
														},
														state: {
															type: "object",
															properties: {
																name: {
																	type: "string",
																},
															},
															required: ["name"],
														},
														country: {
															type: "object",
															properties: {
																code: {
																	type: "string",
																},
															},
															required: ["code"],
														},
														area_code: {
															type: "string",
														},
													},
													required: [
														"gps",
														"address",
														"city",
														"state",
														"country",
														"area_code",
													],
												},
												contact: {
													type: "object",
													properties: {
														phone: {
															type: "string",
														},
														email: {
															type: "string",
														},
													},
													required: ["phone", "email"],
												},
											},
											required: ["type", "location", "contact"],
										},
									},
								},
								required: ["id", "type", "stops"],
							},
						},
						billing: {
							type: "object",
							properties: {
								name: {
									type: "string",
								},
								address: {
									type: "string",
								},
								city: {
									type: "string",
								},
								state: {
									type: "string",
								},
								tax_id: {
									type: "string",
								},
								phone: {
									type: "string",
								},
								email: {
									type: "string",
								},
								time: {
									type: "object",
									properties: {
										timestamp: {
											type: "string",
										},
									},
									required: ["timestamp"],
								},
							},
							required: [
								"name",
								"address",
								"city",
								"state",
								"tax_id",
								"phone",
								"email",
								"time",
							],
						},
						payments: {
							type: "object",
							properties: {
								collected_by: {
									type: "string",
								},
								type: {
									type: "string",
								},
								tags: {
									type: "array",
									items: [
										{
											type: "object",
											properties: {
												descriptor: {
													type: "object",
													properties: {
														code: {
															type: "string",
														},
													},
													required: ["code"],
												},
												list: {
													type: "array",
													items: [
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
													],
												},
											},
											required: ["descriptor", "list"],
										},
										{
											type: "object",
											properties: {
												descriptor: {
													type: "object",
													properties: {
														code: {
															type: "string",
														},
													},
													required: ["code"],
												},
												list: {
													type: "array",
													items: [
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
														{
															type: "object",
															properties: {
																descriptor: {
																	type: "object",
																	properties: {
																		code: {
																			type: "string",
																		},
																	},
																	required: ["code"],
																},
																value: {
																	type: "string",
																},
															},
															required: ["descriptor", "value"],
														},
													],
												},
											},
											required: ["descriptor", "list"],
										},
									],
								},
							},
							required: ["collected_by", "type", "tags"],
						},
						xinput: {
							type: "object",
							properties: {
								form: {
									type: "object",
									properties: {
										url: {
											type: "string",
										},
										mime_type: {
											type: "string",
										},
										submission_id: {
											type: "string",
										},
										status: {
											type: "string",
											const: "SUCCESS",
										},
									},
									required: ["url", "mime_type", "submission_id"],
								},
								required: {
									type: "boolean",
								},
							},
							required: ["form", "required"],
						},
					},
					required: [
						"provider",
						"items",
						"fulfillments",
						"billing",
						"payments",
						"xinput",
					],
				},
			},
			required: ["order"],
		},
	},
	required: ["context", "message"],
};