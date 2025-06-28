export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  date: string;
  is_archived: boolean; 
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product; // For selecting
        Insert: Omit<Product, 'id' | 'date'>; // For inserting
        Update: Partial<Product>; // For updating
      };
    };
  };
};
