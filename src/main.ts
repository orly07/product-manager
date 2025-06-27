import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  RouterModule,
  RouterOutlet,
  Router,
  ActivatedRoute,
} from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  provideRouter,
  Routes,
  withComponentInputBinding,
} from '@angular/router';

// Data Model
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  date: string;
}

// Data Service
class DataService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 129.99,
      date: '2024-01-15',
    },
    {
      id: 2,
      name: 'Office Chair',
      category: 'Furniture',
      price: 199.5,
      date: '2024-02-20',
    },
    {
      id: 3,
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 89.99,
      date: '2024-03-10',
    },
  ];

  private archivedProducts: Product[] = [];

  getAllProducts(): Product[] {
    return this.products;
  }

  getArchivedProducts(): Product[] {
    return this.archivedProducts;
  }

  getProductById(id: number): Product | undefined {
    return (
      this.products.find((p) => p.id === id) ||
      this.archivedProducts.find((p) => p.id === id)
    );
  }

  addProduct(product: Omit<Product, 'id' | 'date'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateNewId(),
      date: new Date().toISOString().split('T')[0],
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(
    id: number,
    updatedProduct: Partial<Product>
  ): Product | undefined {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      return this.products[index];
    }
    return undefined;
  }

  archiveProduct(id: number): boolean {
    const index = this.products.findIndex((p) => p.id === id);
    if (index !== -1) {
      const [archivedProduct] = this.products.splice(index, 1);
      this.archivedProducts.push(archivedProduct);
      return true;
    }
    return false;
  }

  restoreProduct(id: number): boolean {
    const index = this.archivedProducts.findIndex((p) => p.id === id);
    if (index !== -1) {
      const [restoredProduct] = this.archivedProducts.splice(index, 1);
      this.products.push(restoredProduct);
      return true;
    }
    return false;
  }

  private generateNewId(): number {
    const allProducts = [...this.products, ...this.archivedProducts];
    const maxId = allProducts.reduce(
      (max, product) => (product.id > max ? product.id : max),
      0
    );
    return maxId + 1;
  }
}

// Archive List Component
@Component({
  selector: 'app-archive-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterModule],
  template: `
    <div class="card">
      <div class="card-header bg-secondary text-white">
        <h4>Archived Products</h4>
      </div>
      <div class="card-body">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Added Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of archivedProducts; track product.id) {
            <tr>
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price | currency }}</td>
              <td>{{ product.date | date : 'mediumDate' }}</td>
              <td>
                <button
                  class="btn btn-sm btn-success"
                  (click)="restoreProduct(product.id)"
                >
                  Restore
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>
        <a routerLink="/" class="btn btn-primary">Back to Products</a>
      </div>
    </div>
  `,
})
export class ArchiveListComponent implements OnInit {
  archivedProducts: Product[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.loadArchivedProducts();
  }

  loadArchivedProducts() {
    this.archivedProducts = this.dataService.getArchivedProducts();
  }

  restoreProduct(id: number) {
    if (confirm('Are you sure you want to restore this product?')) {
      this.dataService.restoreProduct(id);
      this.loadArchivedProducts();
    }
  }
}

// Product List Component
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterModule],
  template: `
    <div class="card">
      <div
        class="card-header bg-primary text-white d-flex justify-content-between align-items-center"
      >
        <h4>Product List</h4>
        <div>
          <a routerLink="/add" class="btn btn-light me-2">Add New Product</a>
          <a routerLink="/archive" class="btn btn-light">View Archive</a>
        </div>
      </div>
      <div class="card-body">
        <table class="table table-striped table-hover">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Added Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (product of products; track product.id) {
            <tr>
              <td>{{ product.id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>{{ product.price | currency }}</td>
              <td>{{ product.date | date : 'mediumDate' }}</td>
              <td>
                <button
                  class="btn btn-sm btn-warning me-1"
                  [routerLink]="['/edit', product.id]"
                >
                  Edit
                </button>
                <button
                  class="btn btn-sm btn-danger"
                  (click)="archiveProduct(product.id)"
                >
                  Archive
                </button>
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products = this.dataService.getAllProducts();
  }

  archiveProduct(id: number) {
    if (confirm('Are you sure you want to archive this product?')) {
      this.dataService.archiveProduct(id);
      this.loadProducts();
    }
  }
}

// Add Product Component
@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="card-header bg-success text-white">
        <h4>Add New Product</h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="addProduct()">
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="newProduct.name"
              name="name"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Category</label>
            <select
              class="form-select"
              [(ngModel)]="newProduct.category"
              name="category"
              required
            >
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
            <input
              type="number"
              class="form-control"
              [(ngModel)]="newProduct.price"
              name="price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-primary me-md-2">
              Add Product
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              routerLink="/"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class AddProductComponent {
  newProduct: Omit<Product, 'id' | 'date'> = {
    name: '',
    category: '',
    price: 0,
  };

  constructor(private dataService: DataService, private router: Router) {}

  addProduct() {
    this.dataService.addProduct(this.newProduct);
    this.router.navigate(['/']);
  }
}

// Edit Product Component (This was missing in previous versions)
@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="card">
      <div class="card-header bg-warning text-dark">
        <h4>Edit Product</h4>
      </div>
      <div class="card-body">
        <form (ngSubmit)="updateProduct()">
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input
              type="text"
              class="form-control"
              [(ngModel)]="product.name"
              name="name"
              required
            />
          </div>

          <div class="mb-3">
            <label class="form-label">Category</label>
            <select
              class="form-select"
              [(ngModel)]="product.category"
              name="category"
              required
            >
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
            <input
              type="number"
              class="form-control"
              [(ngModel)]="product.price"
              name="price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div class="d-grid gap-2 d-md-flex justify-content-md-end">
            <button type="submit" class="btn btn-warning me-md-2">
              Update Product
            </button>
            <button
              type="button"
              class="btn btn-outline-secondary"
              routerLink="/"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class EditProductComponent implements OnInit {
  product!: Product;

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    const foundProduct = this.dataService.getProductById(+id);

    if (foundProduct) {
      this.product = { ...foundProduct };
    } else {
      this.router.navigate(['/']);
    }
  }

  updateProduct() {
    this.dataService.updateProduct(this.product.id, this.product);
    this.router.navigate(['/']);
  }
}

// App Routes
const routes: Routes = [
  { path: '', component: ProductListComponent, pathMatch: 'full' },
  { path: 'add', component: AddProductComponent },
  { path: 'edit/:id', component: EditProductComponent },
  { path: 'archive', component: ArchiveListComponent },
];

// App Component
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand" routerLink="/">Product Manager</a>
        <div>
          <a routerLink="/" class="btn btn-outline-light me-2">View Products</a>
          <a routerLink="/archive" class="btn btn-outline-light me-2"
            >View Archive</a
          >
          <a routerLink="/add" class="btn btn-outline-light">Add Product</a>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      body {
        padding-top: 20px;
        background-color: #f8f9fa;
      }
      .container {
        max-width: 1200px;
      }
      .card {
        margin-bottom: 20px;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
      }
      .table {
        font-size: 0.9rem;
      }
      .btn-light {
        background-color: #f8f9fa;
        border-color: #dee2e6;
      }
    `,
  ],
})
export class AppComponent {}

// Bootstrap the application
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes, withComponentInputBinding()), DataService],
}).catch((err) => console.error(err));
