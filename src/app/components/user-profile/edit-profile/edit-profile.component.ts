import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FirebaseApp } from '@angular/fire/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from '../../../models/user.model';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, ImageCropperComponent],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  userForm: FormGroup;
  profileUser: User | null = null;
  isLoading = true;
  previewUrl: string | null = null;
  imageChangedEvent: any = '';
  croppedImage: string = '';
  croppedBlob: Blob | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private firebaseApp: FirebaseApp,
    private router: Router,
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      profilePicture: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const db = getFirestore(this.firebaseApp);
    const userId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.authService.user();

    if (currentUser && userId !== currentUser.uid) {
      this.router.navigate(['/users', currentUser.uid, 'edit']);
    }

    if (userId) {
      this.fetchUserProfile(userId);
    } else {
      this.isLoading = false;
      const currentUser = this.authService.user();
      if (currentUser) {
        this.profileUser = currentUser;
        this.setFormValues();
      }
    }
  }

  private async fetchUserProfile(userId: string) {
    const db = getFirestore(this.firebaseApp);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      this.profileUser = userDoc.data() as User;
      this.setFormValues();
    } else {
      console.error('User not found');
    }
    this.isLoading = false;
  }

  private setFormValues() {
    if (this.profileUser) {
      this.userForm.patchValue({
        username: this.profileUser.username,
        email: this.profileUser.email,
        profilePicture: this.profileUser.profilePicture,
      });
    }
  }

  get isOwnProfile(): boolean {
    const loggedInUser = this.authService.user();
    return loggedInUser?.uid === this.profileUser?.uid;
  }


  onFileSelected(event: Event): void {
    console.log('File selected!');
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    console.log('Selected file:', file?.name, file?.type);
  
    if (file && file.type.startsWith('image/')) {
      this.imageChangedEvent = event;
    } else {
      console.warn('Invalid file type');
    }
  }
  

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
    return new Blob([intArray], { type: 'image/png' });
  }

  imageCropped(event: any): void {
    if (event.blob) {
      this.croppedBlob = event.blob;
      this.croppedImage = URL.createObjectURL(event.blob);
      console.log('Blob set. Size:', event.blob.size);
    }
  }

  async onSubmit() {
    if (this.userForm.invalid) return;
  
    try {
      const userId = this.profileUser?.uid;
      if (!userId) return;
  
      let profilePictureUrl = this.userForm.value.profilePicture;
  
      if (this.croppedBlob) {
        await this.storageService.deleteAllProfilePictures(userId);

        console.log('Uploading blob...');
        profilePictureUrl = await this.storageService.uploadCroppedProfilePicture(this.croppedBlob, userId);
        console.log('Uploaded image URL:', profilePictureUrl);
      }
  
      const updatedUser = {
        username: this.userForm.value.username,
        profilePicture: profilePictureUrl,
      };
  
      const db = getFirestore(this.firebaseApp);
      await updateDoc(doc(db, 'users', userId), updatedUser);
      console.log('Profile updated!');
      this.router.navigate([`/users/${userId}`]);
  
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
  
  
}