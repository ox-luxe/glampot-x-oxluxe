import { NextFunction, Request, Response } from "express";

export async function extractProductWebhookForFurtherProcessing(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const pubSubMessage = req.body.message;
    let productWebhook;

    if (process.env.NODE_ENV === "development") {
      productWebhook = pubSubMessage.data;
    }

    if (process.env.NODE_ENV === "production") {
      productWebhook = JSON.parse(
        Buffer.from(pubSubMessage.data, "base64").toString()
      );
    }

    res.locals.productWebhook = productWebhook;

    return next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
