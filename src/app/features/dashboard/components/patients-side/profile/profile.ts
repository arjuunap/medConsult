import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/authServices/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  constructor(private authService: AuthService, private router: Router,
    private cd: ChangeDetectorRef
  ) { }

  // ─── Fields ───
  id = '';
  fullName = '';
  email = '';
  phone = '';
  language = '';
  profilePhoto = '';
  selectedFile: File | null = null;
  ngOnInit(): void {
    this.authService.UserDetails().subscribe({
      next: (res) => {
        console.log('User Details profile:', res);

        this.id = res.id || '';
        this.fullName = res.fullName || '';
        this.email = res.email || '';
        this.phone = res.phone || '';
        this.language = res.language || '';
        this.profilePhoto = res.profilePhoto || '';
        this.cd.detectChanges()
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });

  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // ─── Photo Upload ───
  triggerPhotoUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePhoto = reader.result as string;
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  // ─── Save ───
  saveProfile(): void {
    if (!this.fullName.trim()) {
      alert('Full name is required.');
      return;
    }
    if (!this.email.trim()) {
      alert('Email is required.');
      return;
    }

    const profileData = {
      id: this.id,
      fullName: this.fullName,
      phone: this.phone,
      language: this.language,
      // profilePhoto: this.profilePhoto
    };
    // multipart form data for file upload
    const formData = new FormData();
    formData.append(
      'data',new Blob(
        [JSON.stringify(profileData)],
        {
          type: 'application/json'
        }
      )
    );
    if (this.selectedFile) {

      formData.append(
        'profilePhoto',
        this.selectedFile
      );
    }

    console.log('Updating profile...');

    console.log('Saving profile:', profileData);``
    this.authService.updateProfile(formData).subscribe({
      next: (res) => {
        alert('Profile updated successfully!');
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Failed to update profile. Please try again.');
      }
    });
  }

  // ─── Register Actions ───
  registerAsPatient(): void {
    ;
    this.router.navigate(['patient-register']);
  }

  registerAsDoctor(): void {
    this.router.navigate(['dr-register']);
  }
}