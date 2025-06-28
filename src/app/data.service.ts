import { Injectable } from '@angular/core';
import { supabase } from '../supabase';
import { Product } from '../types/supabase'; // make sure path matches

@Injectable({ providedIn: 'root' })
export class DataService {

  // Fetch all products, can filter by archived status
  async getAll(filter?: { archived: boolean }): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_archived', filter?.archived ?? false)  // Default to 'false' if no filter
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Add a new product
  async add(p: Omit<Product, 'id' | 'date'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([p])
      .select()
      .single();

    if (error) throw error;
    return data!;
  }

  // Update an existing product (e.g., to archive or restore)
  async update(id: number, updates: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data!;
  }

  // Delete a product permanently
  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
