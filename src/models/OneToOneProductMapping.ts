import { db } from "../config/db";

export class OneToOneProductMapping {
  constructor() {
  }

  static async save(oxluxeProductId: number, glampotProductId: string) {
    try {
        let sql =  `INSERT INTO 
        \`glampot_integration\`.\`one_to_one_product_mapping\` 
          (\`oxluxe_product_id\`, \`glampot_product_id\`) 
        VALUES 
          ('${oxluxeProductId}', '${glampotProductId}');`;
        let result = await db.execute(sql);
        console.log(result);
        
    } catch (error) {
      console.log(error);
    }
  }

  static async find(productId: string) {
    try {
      let sql = `select * from one_to_one_product_mapping where oxluxe_product_id=${productId};`;
      let result = await db.execute(sql);
      // @ts-ignore
      return result[0].length > 0 ? result[0][0] : undefined;
      
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(oxluxeProductId: number) {
    try {
      let sql = `delete from one_to_one_product_mapping where oxluxe_product_id=${oxluxeProductId};`;
      let result = await db.execute(sql);
      return result;
      
    } catch (error) {
      console.log(error);
    }
  }
}
