export interface User {
  _id: string;
  name: string;
  email: string;
  cartItems: Record<string, number>;
}