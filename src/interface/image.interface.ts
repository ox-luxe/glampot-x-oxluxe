export interface Image {
  id: number;
  product_id: number;
  position: number;
  created_at?: any;
  updated_at?: any;
  alt?: any;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
  admin_graphql_api_id: string;
}