import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="card-header bg-success text-white">
        <h4>Add Product</h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="submit()" #form="ngForm">
          <div class="mb-3">
            <label>Name</label>
            <input type="text" class="form-control" [(ngModel)]="model.name" name="name" required />
          </div>
          <div class="mb-3">
            <label>Category</label>
            <input type="text" class="form-control" [(ngModel)]="model.category" name="category" required />
          </div>
          <div class="mb-3">
            <label>Price</label>
            <input type="number" class="form-control" [(ngModel)]="model.price" name="price" required />
          </div>
          <button type="submit" class="btn btn-success" [disabled]="form.invalid">Add</button>
        </form>
      </div>
    </div>
  `
})
export class AddProductComponent {
  model = { name: '', category: '', price: 0 };

  constructor(private ds: DataService, private router: Router) {}

  async submit() {
    await this.ds.add(this.model);
    this.router.navigate(['']);
  }
}
