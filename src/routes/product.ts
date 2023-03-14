import express from "express";
import { verifyPubsubMessage } from "../middleware/verifyPubsubMessage";
import { verifyWebhookType } from "../middleware/verifyWebhookType";
import { productControllers } from "../controllers/productControllers";
import { OneToOneProductMapping } from "../models/OneToOneProductMapping";
import { ShopifyStore } from "../services/ShopifyStore"; 
import { extractProductWebhookForFurtherProcessing } from "../middleware/extractProductWebhookForFurtherProcessing";
const router = express.Router();

function productRoute() {
  router.use(
    extractProductWebhookForFurtherProcessing, // ends here if product is not tagged with "Glampot"
    verifyPubsubMessage, // ends here if webhook does not have expected shape
  );

  router
    .route("/")
    .post(
      verifyWebhookType,
      productControllers.createNewProduct,
      productControllers.updateProduct,
      productControllers.deleteProduct,
    );

  router
    .route("/delete")
    .post(async (req, res) => {
      let productWebhook = res.locals.productWebhook;
      
      const glampotShopifyStore = new ShopifyStore(
        process.env.GLAMPOT_STORE_NAME!,
        process.env.GLAMPOT_STORE_ACCESS_TOKEN!
      );
      
      const uniqueProductMapping = await OneToOneProductMapping.find(productWebhook.id);
      
      if (uniqueProductMapping) {
        await glampotShopifyStore.deleteProduct({ ...productWebhook, correspondingGlampotProductId: uniqueProductMapping.glampot_product_id });
      }
      res.status(204).send();
    })

  return router;
}

export { productRoute };
