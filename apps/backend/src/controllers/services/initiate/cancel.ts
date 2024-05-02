import { Request, Response } from "express";
import { createAuthHeader, redis, logger, redisFetch } from "../../../lib/utils";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateCancelController = async (req: Request, res: Response) => {
  const { transactionId, orderId, cancellationReasonId } = req.body;
  // const transactionKeys = await redis.keys(`${transactionId}-*`);

  // const ifTransactionExist = transactionKeys.filter((e) =>
  //   e.includes("on_confirm-to-server")
  // );

  // if (ifTransactionExist.length === 0) {
  //   return res.status(400).json({
  //     message: {
  //       ack: {
  //         status: "NACK",
  //       },
  //     },
  //     error: {
  //       message: "On Confirm doesn't exist",
  //     },
  //   });
  // }
  // const transaction = await redis.mget(ifTransactionExist);
  // const parsedTransaction = transaction.map((ele) => {
  //   return JSON.parse(ele as string);
  // });
  const on_confirm = await redisFetch("on_confirm", transactionId)
  if (!on_confirm) {
    return res.status(400).json({
      message: {
        ack: {
          status: "NACK",
        },
      },
      error: {
        message: "On Confirm doesn't exist",
      },
    });
  }
  // console.log("parsedTransaction:::: ", parsedTransaction[0]);
  return intializeRequest(res, on_confirm, orderId, cancellationReasonId);
}

const intializeRequest = async (res: Response, transaction: any, order_id: string, cancellation_reason_id: string) => {
  const { context } = transaction;

  const cancel = {
    context: {
      ...context,
      action: "cancel",
      message_id: uuidv4()
    },
    message: {
      order_id,
      cancellation_reason_id
    }
  }
  const header = await createAuthHeader(cancel);
  try {
    await redis.set(
      `${context.transaction_id}-cancel-from-server`,
      JSON.stringify({ request: { ...cancel } })
    );
    const response = await axios.post(`${context.bpp_uri}/cancel?scenario=ack`, cancel, {
      headers: {
        "X-Gateway-Authorization": header,
        authorization: header,
      },
    });
    await redis.set(
      `${context.transaction_id}-cancel-from-server`,
      JSON.stringify({
        request: { ...cancel },
        response: {
          response: response.data,
          timestamp: new Date().toISOString(),
        },
      })
    );

    return res.json({
      message: {
        ack: {
          status: "ACK",
        },
      },
      transaction_id: context.transaction_id,
    });
  } catch (error) {
    logger.error({ type: "response", message: error });
    // console.log("ERROR :::::::::::::", (error as any).response?.data.error);

    if (error instanceof AxiosError) {
      return res.json({
        message: {
          ack: {
            status: "NACK",
          },
        },
        error: {
          // message: (error as any).message,
          message: error.response?.data.error.message,
        },
      });
    }
    return res.json({
      message: {
        ack: {
          status: "NACK",
        },
      },
      error: {
        // message: (error as any).message,
        message: "Error Occurred while pinging NP at BPP URI",
      },
    });
  }

}