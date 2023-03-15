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
    extractProductWebhookForFurtherProcessing, 
    verifyPubsubMessage
  );

  router
    .route("/")
    .post(
      verifyWebhookType,
      productControllers.createNewProduct,
      productControllers.updateProduct,
      productControllers.deleteProduct
    );

  router.route("/delete").post(async (req, res) => {
    console.log("product delete endpoint reached");
    let productWebhook = res.locals.productWebhook;

    const oxluxeShopifyStore = new ShopifyStore(
      process.env.OXLUXE_STORE_NAME!,
      process.env.OXLUXE_STORE_ACCESS_TOKEN!
    );

    const uniqueProductMapping = await OneToOneProductMapping.find(
      productWebhook.id
    );

    console.log(uniqueProductMapping);
      

    if (uniqueProductMapping) {
      await oxluxeShopifyStore.deleteProduct({
        ...productWebhook,
        correspondingOxluxeProductId: uniqueProductMapping.oxluxe_product_id,
      });
    }
    res.status(204).send();
  });

  return router;
}

export { productRoute };
