import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL, listAll, deleteObject } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: Storage) { }

  async uploadProfilePicture(file: File, userId: string, pathPrefix = 'profile'): Promise<string> {
    const storageRef = ref(this.storage, `user_uploads/${userId}/${pathPrefix}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  async uploadFile(file: File, userId: string): Promise<{ url: string; fileName: string }> {
    const filePath = `user_uploads/${userId}/catalog_items/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
  
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
  
    return { url, fileName: file.name };
  }
  

  async uploadCroppedProfilePicture(blob: Blob, userId: string, pathPrefix = 'profile'): Promise<string> {
    const fileName = `cropped_${Date.now()}.png`;
    const storageRef = ref(this.storage, `user_uploads/${userId}/${pathPrefix}/${fileName}`);
    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  }

  async deleteAllProfilePictures(userId: string): Promise<void> {
    const folderRef = ref(this.storage, `user_uploads/${userId}/profile/`)

    try {
      const result = await listAll(folderRef);
      const deletionPromises = result.items.map((item) => deleteObject(item));
      await Promise.all(deletionPromises);
      console.log(`Deleted ${deletionPromises.length} old profile picture(s).`);
    } catch (error) {
      console.error('Error deleting old profile pictures:', error);
    }
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    try {
      const fileRef = ref(this.storage, fileUrl);
      await deleteObject(fileRef);
    } catch (error) {
      console.warn('Failed to delete previous file:', error);
    }
  }
};

