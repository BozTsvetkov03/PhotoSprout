import { Injectable } from '@angular/core';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc,
  updateDoc 
} from 'firebase/firestore';
import { CatalogItem } from '../types';
import { FirebaseApp } from '@angular/fire/app';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private db;
  private catalogCollection;

  constructor(firebaseApp: FirebaseApp) {
    this.db = getFirestore(firebaseApp);
    this.catalogCollection = collection(this.db, 'catalogItems');
  }

  async fetchItems(): Promise<CatalogItem[]> {
    try {
      const querySnapshot = await getDocs(this.catalogCollection);
      const items: CatalogItem[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data['imgName'],
          description: data['description'],
          image: data['source'],
          fileName: data['fileName'],   // ✅ include stored file name
          author: {
            id: data['authorId'],
            username: data['authorUsername']
          }
        };
      });

      return items;
    } catch (error) {
      console.error('Error fetching catalog items', error);
      return [];
    }
  }

  async fetchItemById(id: string): Promise<CatalogItem | null> {
    try {
      const itemDocRef = doc(this.db, 'catalogItems', id);
      const docSnap = await getDoc(itemDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        return {
          id: docSnap.id,
          title: data['imgName'],
          description: data['description'],
          image: data['source'],
          fileName: data['fileName'],  // ✅ added
          author: {
            id: data['authorId'],
            username: data['authorUsername']
          }
        };
      } else {
        console.log(`Couldn't find document!`);
        return null;
      }
    } catch (error) {
      console.log('Error fetching catalog item by ID', error);
      return null;
    }
  }

  async addCatalogItem(data: {
    imgName: string;
    description: string;
    source: string;
    fileName: string;   // ✅ require fileName
    authorId: string;
    authorUsername: string;
  }): Promise<void> {
    try {
      await addDoc(this.catalogCollection, {
        imgName: data.imgName,
        description: data.description,
        source: data.source,
        fileName: data.fileName,   // ✅ store real storage filename
        authorId: data.authorId,
        authorUsername: data.authorUsername
      });
    } catch (error) {
      console.error('Error adding catalog item:', error);
      throw error;
    }
  }

  async updateCatalogItem(
    id: string,
    data: { title: string; description: string; image: string; fileName?: string } // <-- optional
  ): Promise<void> {
    try {
      const itemDocRef = doc(this.db, 'catalogItems', id);
      const updateData: any = {
        imgName: data.title,
        description: data.description,
        source: data.image,
      };
  
      if (data.fileName) {
        updateData.fileName = data.fileName;
      }
  
      await updateDoc(itemDocRef, updateData);
    } catch (error) {
      console.error('Error updating catalog item:', error);
      throw error;
    }
  }
  }
