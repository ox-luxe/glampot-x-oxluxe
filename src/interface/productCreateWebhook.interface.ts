import { Image } from "./image.interface";
import { ProductVariantInput } from "./variant.interface";
import { Option } from "./option.interface";

export interface ProductCreateWebhook {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at?: any;
  handle: string;
  updated_at: Date;
  published_at: Date;
  template_suffix?: any;
  status: string;
  published_scope: string;
  tags: string;
  admin_graphql_api_id: string;
  variants: ProductVariantInput[];
  options: Option[];
  images: Image[];
  image?: any;
}
