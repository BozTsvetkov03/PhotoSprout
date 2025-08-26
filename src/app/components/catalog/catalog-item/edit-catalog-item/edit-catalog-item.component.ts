import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { CatalogService } from '../../../../services/catalog.service';
import { CatalogItem } from '../../../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../services/storage.service';

@Component({
  selector: 'app-edit-catalog-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-catalog-item.component.html',
  styleUrl: './edit-catalog-item.component.css'
})
export class EditCatalogItemComponent implements OnInit {
  item: CatalogItem | null = null;
  editForm!: FormGroup;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const itemId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.user();

    if (!itemId || !currentUser) {
      this.router.navigate(['/catalog']);
      return;
    }

    this.catalogService.fetchItemById(itemId).then(item => {
      if (!item) {
        this.router.navigate(['/catalog']); // not found
        return;
      }

      if (item.author.id !== currentUser.uid) {
        this.router.navigate(['/catalog']); // not owner
        return;
      }

      this.item = item;

      this.editForm = this.fb.group({
        title: [item.title, [Validators.required, Validators.minLength(3)]],
        description: [item.description, [Validators.required, Validators.minLength(5)]],
        image: [item.image]
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.editForm.patchValue({ image: this.previewUrl });
      };
      reader.readAsDataURL(file);
  
      this.selectedFile = file;
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.item || this.editForm.invalid) return;
  
    const currentUser = this.authService.user();
    if (!currentUser) return;
  
    let imageUrl = this.editForm.value.image; // if no new file

    if (this.selectedFile) {
      // Delete previous file if it exists
      if (this.item.image) {
        try {
          const filePath = this.getPathFromUrl(this.item.image);
          await this.storageService.deleteFileByUrl(filePath);
        } catch (err) {
          console.warn('Failed to delete previous file:', err);
        }
      }
  
      const uploaded = await this.storageService.uploadFile(this.selectedFile, currentUser.uid);
      imageUrl = uploaded.url;
    }

    const updatedItem: CatalogItem = {
      ...this.item,
      title: this.editForm.value.title,
      description: this.editForm.value.description,
      image: imageUrl,
      fileName: this.selectedFile?.name || this.item.fileName
    };
  
    await this.catalogService.updateCatalogItem(updatedItem.id, {
      title: updatedItem.title,
      description: updatedItem.description,
      image: updatedItem.image,
      fileName: updatedItem.fileName
    });
  
    this.router.navigate(['/catalog', updatedItem.id]);
  }
  
  // extract firebase storage path (i need to find a better solution)
  private getPathFromUrl(url: string): string {
    const baseUrl = url.split('?')[0];
    const parts = baseUrl.split('/o/');
    if (parts.length < 2) throw new Error('Invalid Firebase Storage URL');
    return decodeURIComponent(parts[1]);
  }
  
  onCancel(): void {
    if (this.item) {
      this.router.navigate(['/catalog', this.item.id]);
    } else {
      this.router.navigate(['/catalog']);
    }
  }
}
