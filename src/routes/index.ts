import express, { Request, Response } from "express";
import { productRoute } from "./product";
const router = express.Router();

function routes() {
  router.get("/healthcheck", (req: Request, res: Response) => {
    res.send({ message: "Server Active!" });
  });
  
  router.use("/glampot/products", productRoute());
  // add additional routes here
  return router;
}

export { routes };