// src/app/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
          <button class="btn btn-light" (click)="toggleArchived()">
            {{ showArchived ? 'Show Active Products' : 'Show Archived Products' }}
          </button>
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
            <tr *ngFor="let product of filteredProducts">
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.date | date: 'mediumDate' }}</td>
              <td>
                <a *ngIf="!product.is_archived" [routerLink]="['/edit', product.id]" class="btn btn-sm btn-warning me-1">Edit</a>
                <button *ngIf="!product.is_archived" class="btn btn-sm btn-warning" (click)="archive(product.id)">Archive</button>
                <button *ngIf="product.is_archived" class="btn btn-sm btn-danger" (click)="delete(product.id)">Delete</button>
                <button *ngIf="product.is_archived" class="btn btn-sm btn-success" (click)="restore(product.id)">Restore</button>
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
  showArchived = false; // To toggle between archived and active products

  constructor(private ds: DataService) {}

  async ngOnInit() {
    this.load();
  }

  async load() {
    // Fetch products based on the showArchived flag
    this.products = await this.ds.getAll({ archived: this.showArchived });
  }

  get filteredProducts() {
    // Filter based on the showArchived flag
    return this.products.filter(p => p.is_archived === this.showArchived);
  }

  toggleArchived() {
    this.showArchived = !this.showArchived;
    this.load();  // Reload the products when the button is toggled
  }

  async archive(id: number) {
    if (confirm('Are you sure you want to archive this product?')) {
      await this.ds.update(id, { is_archived: true });
      this.load();
    }
  }

  async restore(id: number) {
    if (confirm('Are you sure you want to restore this product?')) {
      await this.ds.update(id, { is_archived: false });
      this.load();
    }
  }

  async delete(id: number) {
    if (confirm('Are you sure you want to permanently delete this product?')) {
      await this.ds.delete(id);
      this.load();
    }
  }
}
