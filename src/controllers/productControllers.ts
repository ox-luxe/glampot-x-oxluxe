import { Request, Response, NextFunction } from "express";
import { ShopifyStore } from "../services/ShopifyStore";

async function createNewProduct(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.locals.productWebhookType !== "create") {
    return next();
  }

  try {
    let productWebhook = res.locals.productWebhook;

    const oxluxeShopifyStore = new ShopifyStore(
      process.env.OXLUXE_STORE_NAME!,
      process.env.OXLUXE_STORE_ACCESS_TOKEN!
    );

    // seperately fetching cost information from origin store as it is not included inside webhook
    const glampotShopifyStore = new ShopifyStore(
      process.env.GLAMPOT_STORE_NAME!,
      process.env.GLAMPOT_STORE_ACCESS_TOKEN!
    );

    const variantId = ShopifyStore.getVariantIdFromProductCreateWebhook(productWebhook);
    const productCost = await glampotShopifyStore.findCostOfProductByVariantId(variantId);
    await oxluxeShopifyStore.createProduct({ ...productWebhook, productCost });

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

async function updateProduct(req: Request, res: Response, next: NextFunction) {
  if (res.locals.productWebhookType !== "update") {
    return next();
  }

  try {
    let productWebhook = res.locals.productWebhook;

    const oxluxeShopifyStore = new ShopifyStore(
      process.env.OXLUXE_STORE_NAME!,
      process.env.OXLUXE_STORE_ACCESS_TOKEN!
    );

    const glampotShopifyStore = new ShopifyStore(
      process.env.GLAMPOT_STORE_NAME!,
      process.env.GLAMPOT_STORE_ACCESS_TOKEN!
    );

    const variantId = ShopifyStore.getVariantIdFromProductCreateWebhook(productWebhook);
    const productCost = await glampotShopifyStore.findCostOfProductByVariantId(variantId);
    const correspondingOxluxeProductId = res.locals.oneToOneProductMapping.oxluxe_product_id;

    await oxluxeShopifyStore.updateProduct({
      ...productWebhook,
      productCost,
      correspondingOxluxeProductId,
    });

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  if (res.locals.productWebhookType !== "delete") {
    return next();
  }

  try {
    let productWebhook = res.locals.productWebhook;

    const oxluxeShopifyStore = new ShopifyStore(
      process.env.OXLUXE_STORE_NAME!,
      process.env.OXLUXE_STORE_ACCESS_TOKEN!
    );

    const correspondingOxluxeProductId = res.locals.oneToOneProductMapping.oxluxe_product_id;
    console.log(`oxluxe product id from deleteProduct function: ${correspondingOxluxeProductId}`);
    
    await oxluxeShopifyStore.deleteProduct({
      ...productWebhook,
      correspondingOxluxeProductId,
    });

    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
}

const productControllers = {
  createNewProduct,
  updateProduct,
  deleteProduct,
};

export { productControllers };
