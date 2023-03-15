import { db } from "../config/db";

export class OneToOneProductMapping {
  constructor() {
  }

  static async save(glampotProductId: number, oxluxeProductId: string) {
    try {
        let sql =  `INSERT INTO 
        \`glampot_integration\`.\`one_to_one_product_mapping2\` 
          (\`oxluxe_product_id\`, \`glampot_product_id\`) 
        VALUES 
          ('${oxluxeProductId}', '${glampotProductId}');`;
        console.log(sql);
        let result = await db.execute(sql);
        console.log(result);
        
    } catch (error) {
      console.log(error);
    }
  }

  static async find(productId: string) {
    try {
      let sql = `select * from one_to_one_product_mapping where glampot_product_id=${productId};`;
      let result = await db.execute(sql);
      // @ts-ignore
      return result[0].length > 0 ? result[0][0] : undefined;
      
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(oxluxeProductId: string) {
    try {
      let sql = `delete from one_to_one_product_mapping2 where oxluxe_product_id=${oxluxeProductId};`;
      console.log("sql statement:"+sql);
      
      let result = await db.execute(sql);
      return result;
      
    } catch (error) {
      console.log(error);
    }
  }
}
