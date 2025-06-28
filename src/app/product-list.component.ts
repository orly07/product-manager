import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from './data.service';
import { Product } from '../types/supabase';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  template: `
    <div class="card">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h4>Product List</h4>
        <div>
          <a routerLink="/add" class="btn btn-light me-2">Add New Product</a>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price}}</td>
              <td>{{ product.date | date: 'mediumDate' }}</td>
              <td>
                <a [routerLink]="['/edit', product.id]" class="btn btn-sm btn-warning me-1">Edit</a>
                <button class="btn btn-sm btn-danger" (click)="delete(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private ds: DataService) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    this.products = await this.ds.getAll();
  }

  async delete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      await this.ds.delete(id);
      this.load();
    }
  }
}
