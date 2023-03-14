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
    const hasGlampotTag = ShopifyStore.doesProductWebhookContainTag(productWebhook, "Glampot");
    
    console.log(oneToOneProductMapping);
    console.log(hasGlampotTag);

    if (oneToOneProductMapping && hasGlampotTag) {
      // these variables are used in the updateProduct controller
      res.locals.productWebhookType = "update";
      res.locals.oneToOneProductMapping = oneToOneProductMapping;
    }
    if (!oneToOneProductMapping && hasGlampotTag) {
      res.locals.productWebhookType = "create";
    }
    if (oneToOneProductMapping && !hasGlampotTag) {
      // these variables are used in the deleteProduct controller
      res.locals.productWebhookType = "delete";
      res.locals.oneToOneProductMapping = oneToOneProductMapping;
    }
    if (!oneToOneProductMapping && !hasGlampotTag) {
      res.status(204).send();
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}
