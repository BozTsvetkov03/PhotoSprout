import { Component, OnInit } from '@angular/core';
import { catalogService } from '../../services/catalogService';
import { CatalogItemComponent } from '../../components/catalog-item/catalog-item.component';
import { CommonModule } from '@angular/common';
import { CatalogItem } from '../../types';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CatalogItemComponent, CommonModule],
  providers: [catalogService],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  items: CatalogItem[] = [];

  constructor(private catalogService: catalogService) {}

  ngOnInit() {
    this.loadItems();
  }

  async loadItems() {
    try {
      const fetchedItems = await this.catalogService.fetchItems();
      
      console.log("Fetched items:", fetchedItems);
      
      this.items = fetchedItems;

      console.log("Items array:", this.items);
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }
}