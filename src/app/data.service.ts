// src/app/data.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../supabase';
import { Product } from '../types/supabase'; // make sure path matches

@Injectable({ providedIn: 'root' })
export class DataService {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id');

    if (error) throw error;
    return data || [];
  }

  async add(p: Omit<Product, 'id' | 'date'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([p])
      .select()
      .single();

    if (error) throw error;
    return data!;
  }

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

  async delete(id: number) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
