import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  query,
  orderBy
} from '@angular/fire/firestore';
import { UserComment } from '../types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {

  constructor(private firestore: Firestore) {}

  async addComment(postId: string, user: any, body: string): Promise<void> {
    const commentsRef = collection(this.firestore, `catalogItems/${postId}/comments`);
  
    await addDoc(commentsRef, {
      authorId: user.uid,
      authorUsername: user.username,
      authorAvatar: user.avatar || null,
      body,
      createdAt: new Date()
    });
  }

  getComments(postId: string) {
    const commentsRef = collection(this.firestore, `catalogItems/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<UserComment[]>;
  }
}
