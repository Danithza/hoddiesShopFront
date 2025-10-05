export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  stock: number
  category_id: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}
