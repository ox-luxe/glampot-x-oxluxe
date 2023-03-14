import { NextFunction, Request, Response } from "express";

export async function verifyPubsubMessage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body) {
      const msg = "no Pub/Sub message received";
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);

      return;
    }
    if (!req.body.message) {
      const msg = "invalid Pub/Sub message format";
      console.error(`error: ${msg}`);
      res.status(400).send(`Bad Request: ${msg}`);
      return;
    }
    next();

  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

