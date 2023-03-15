import { NextFunction, Request, Response } from "express";
import { ShopifyStore } from "../services/ShopifyStore";
import { OneToOneProductMapping } from "../models/OneToOneProductMapping";

export async function verifyWebhookType(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // res.locals.productWebhook came from previous middleware: extractProductWebhookForFurtherProcessing
    let productWebhook = res.locals.productWebhook;

    const oneToOneProductMapping = await OneToOneProductMapping.find(productWebhook.id);
    console.log("one to one product mapping: ");
    console.log(oneToOneProductMapping);
    
    const hasOxluxeTag = ShopifyStore.doesProductWebhookContainTag(
      productWebhook,
      "Oxluxe"
    );

    if (oneToOneProductMapping && hasOxluxeTag) {
      // these variables are used in the updateProduct controller
      res.locals.productWebhookType = "update";
      res.locals.oneToOneProductMapping = oneToOneProductMapping;
    }
    if (!oneToOneProductMapping && hasOxluxeTag) {
      res.locals.productWebhookType = "create";
    }
    if (oneToOneProductMapping && !hasOxluxeTag) {
      // these variables are used in the deleteProduct controller
      res.locals.productWebhookType = "delete";
      res.locals.oneToOneProductMapping = oneToOneProductMapping;
    }
    if (!oneToOneProductMapping && !hasOxluxeTag) {
      res.status(204).send();
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
