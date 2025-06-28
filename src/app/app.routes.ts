import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./product-list.component').then(m => m.ProductListComponent),
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./add-product.component').then(m => m.AddProductComponent),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('./edit-product.component').then(m => m.EditProductComponent),
  },
];
