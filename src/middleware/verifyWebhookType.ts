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
    const hasOxluxeTag = ShopifyStore.doesProductWebhookContainTag(
      productWebhook,
      "Oxluxe"
    );
    console.log(`product webhook info from function: verifyWebhookType`);
    console.log(productWebhook);
    console.log(`Oxluxe:Glampot product id mapping:`);
    console.log(`${oneToOneProductMapping}`);
    console.log(`Product/update webhook contains Oxluxe tag: ${hasOxluxeTag}`);

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

    console.log(`Type of webhook: ${res.locals.productWebhookType}`);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
