import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService} from './data.service';
import { Product } from '../types/supabase';


@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="card-header bg-warning text-dark">
        <h4>Edit Product</h4>
      </div>
      <div class="card-body" *ngIf="model">
        <form (ngSubmit)="submit()">
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input type="text" class="form-control" [(ngModel)]="model.name" name="name" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-select" [(ngModel)]="model.category" name="category" required>
              <option value="">Select a category</option>
              <option>Electronics</option>
              <option>Furniture</option>
              <option>Clothing</option>
              <option>Books</option>
              <option>Appliances</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Price ($)</label>
            <input type="number" class="form-control" [(ngModel)]="model.price" name="price" min="0" step="0.01" required />
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-warning me-md-2">Update Product</button>
            <button type="button" class="btn btn-outline-secondary" [routerLink]="['/']">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class EditProductComponent implements OnInit {
  model!: Product;

  constructor(
    private ds: DataService,
    private ar: ActivatedRoute,
    private r: Router
  ) {}

  async ngOnInit() {
    const id = +this.ar.snapshot.paramMap.get('id')!;
    const all = await this.ds.getAll();
    const found = all.find((p) => p.id === id);
    if (found) this.model = found;
    else this.r.navigate(['/']);
  }

  async submit() {
    await this.ds.update(this.model.id, this.model);
    this.r.navigate(['/']);
  }
}
