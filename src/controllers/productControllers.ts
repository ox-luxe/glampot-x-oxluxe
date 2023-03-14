import { Request, Response, NextFunction } from "express";
import { ShopifyStore } from "../services/ShopifyStore";

async function createNewProduct(req: Request, res: Response, next: NextFunction) {
  if (res.locals.productWebhookType !== "create") {
    return next();
  }

  try {
      let productWebhook = res.locals.productWebhook;

      const glampotShopifyStore = new ShopifyStore(
        process.env.GLAMPOT_STORE_NAME!,
        process.env.GLAMPOT_STORE_ACCESS_TOKEN!
      );

      // seperately fetching cost information from origin store as it is not included inside webhook
      const oxluxeShopifyStore = new ShopifyStore(
        process.env.OXLUXE_STORE_NAME!,
        process.env.OXLUXE_STORE_ACCESS_TOKEN!
      );

      const variantId = ShopifyStore.getVariantIdFromProductCreateWebhook(productWebhook);
      const productCost = await oxluxeShopifyStore.findCostOfProductByVariantId(variantId);
      await glampotShopifyStore.createProduct({ ...productWebhook, productCost });
    
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

      const glampotShopifyStore = new ShopifyStore(
        process.env.GLAMPOT_STORE_NAME!,
        process.env.GLAMPOT_STORE_ACCESS_TOKEN!
      );

      const oxluxeShopifyStore = new ShopifyStore(
        process.env.OXLUXE_STORE_NAME!,
        process.env.OXLUXE_STORE_ACCESS_TOKEN!
      );
      
      const variantId = ShopifyStore.getVariantIdFromProductCreateWebhook(productWebhook);
      const productCost = await oxluxeShopifyStore.findCostOfProductByVariantId(variantId);
      const correspondingGlampotProductId = res.locals.oneToOneProductMapping.glampot_product_id;
      
      await glampotShopifyStore.updateProduct({ ...productWebhook, productCost, correspondingGlampotProductId });
    
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

      const glampotShopifyStore = new ShopifyStore(
        process.env.GLAMPOT_STORE_NAME!,
        process.env.GLAMPOT_STORE_ACCESS_TOKEN!
      );
      
      const correspondingGlampotProductId = res.locals.oneToOneProductMapping.glampot_product_id;
      await glampotShopifyStore.deleteProduct({ ...productWebhook, correspondingGlampotProductId });
    
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
