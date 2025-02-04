export interface CartMergeRequest {
  items: CartItemDTO[];
}

export interface CartItemDTO {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  imageUrl: string;
}
