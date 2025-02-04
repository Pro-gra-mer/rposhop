import { CartItem } from './CartItem';

export interface Cart {
  id: number;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    active: boolean;
  } | null;
  items: CartItem[];
  total: number;
}
