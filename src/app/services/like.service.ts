import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, deleteDoc, getDoc, updateDoc, increment } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class LikeService {
  constructor(private firestore: Firestore) {}

  async likePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, `catalogItems/${postId}`);
    const likeRef = doc(this.firestore, `catalogItems/${postId}/likes/${userId}`);

    console.log('Liking post:', postId, 'by user:', userId);

    await setDoc(likeRef, {});

    await updateDoc(postRef, { likeCount: increment(1) });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    const postRef = doc(this.firestore, `catalogItems/${postId}`);
    const likeRef = doc(this.firestore, `catalogItems/${postId}/likes/${userId}`);

    await deleteDoc(likeRef);
    await updateDoc(postRef, { likeCount: increment(-1) });
  }


  async hasUserLiked(postId: string, userId: string): Promise<boolean> {
    const likeRef = doc(this.firestore, `catalogItems/${postId}/likes/${userId}`);
    const likeSnap = await getDoc(likeRef);
    return likeSnap.exists();
  }

  async toggleLike(postId: string, userId: string): Promise<void> {
    const hasLiked = await this.hasUserLiked(postId, userId);
    if (hasLiked) {
      await this.unlikePost(postId, userId);
    } else {
      await this.likePost(postId, userId);
    }
  }
}
