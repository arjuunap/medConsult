import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DoctorService } from '../services/doctor'; //add//

@Component({
  selector: 'app-dr-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './dr-register.html',
  styleUrls: ['./dr-register.css'],
})
export class DrRegister implements OnInit {
  doctorForm!: FormGroup;

  errorMsg: string = '';
  successMsg: string = '';
  fieldErrorMessage = ' This field is required';

  // Selected values
  selectedSubSpecialities: string[] = [];

  // Speciality map
  specialityMap: any = {
    Cardiology: ['Interventional Cardiology', 'Non-Invasive Cardiology'],
    Dermatology: ['Cosmetic Dermatology', 'Pediatric Dermatology'],
    Neurology: ['Stroke', 'Epilepsy', 'Neurocritical Care'],
    Orthopedics: ['Joint Replacement', 'Spine Surgery'],
  };

  subSpecialities: string[] = [];

  // Languages list

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService, //add//
  ) {}

  ngOnInit(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (res) => {
        console.log('Doctors :', res); // 👈 HERE is your output
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      },
    });

    // this.doctorService.getUsers().subscribe({
    //   next: (res) => {
    //     console.log('Users :', res); // 👈 HERE is your output
    //   },
    //   error: (err) => {
    //     console.error('Error fetching doctors:', err);
    //   },
    // });
    this.doctorService.getDoctor().subscribe({
      next: (res) => {
        console.log('Doctor :', res); // 👈 HERE is your output
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
      },
    });

    this.doctorForm = this.fb.group({
      userId:['a6634d1e-a070-4eb7-9a15-bacddbe9d5a3'],
      doctorCode: ['', Validators.required],
      speciality: ['', Validators.required],
      subSpecialities: [''],
      licenseNumber: ['', Validators.required],
      licenseAuthority: ['', Validators.required],

      yearsExperience: ['', [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$')]],

      hospitalAffiliation: [''],

      languagesSpoken: [[]],
     

      consultationFee: ['', Validators.pattern('^[0-9]*$')],

      bio: [''],
    });

    //       @HostListener('document:click')
    // closeDropdown() {
    //   this.showLangDropdown = false;
    // }
  }

  get f() {
    return this.doctorForm.controls;
  }

  // ================= SPECIALITY =================
  onSpecialityChange(event: any) {
    const speciality = event.target.value;
    this.subSpecialities = this.specialityMap[speciality] || [];
    this.selectedSubSpecialities = [];
  }

  onSubSpecialityChange(event: any) {
    const value = event.target.value;

    if (event.target.checked) {
      if (!this.selectedSubSpecialities.includes(value)) {
        this.selectedSubSpecialities.push(value);
      }
    } else {
      this.selectedSubSpecialities = this.selectedSubSpecialities.filter((v) => v !== value);
    }
  }

  // ================= LANGUAGES =================
  showLangDropdown = false;

  selectedLanguages: string[] = [];

  availableLanguages = [
    'English',
    'Hindi',
    'Malayalam',
    'Tamil',
    'Telugu',
    'Kannada',
    'Arabic',
    'French',
    'German',
    'Spanish',
    'Chinese',
    'Japanese',
  ];
  toggleLangDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showLangDropdown = !this.showLangDropdown;
  }

  selectLanguage(lang: string, event: Event) {
    event.stopPropagation();

    if (this.selectedLanguages.includes(lang)) {
      this.selectedLanguages = this.selectedLanguages.filter((l) => l !== lang);
    } else {
      this.selectedLanguages = [...this.selectedLanguages, lang];
    }

    this.doctorForm.get('selectedLanguages')?.setValue(this.selectedLanguages);
  }

  // ================= SUBMIT =================
  onSubmit() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.doctorForm.value,
      subSpecialities: this.selectedSubSpecialities,
      languagesSpoken: this.selectedLanguages,
      consultationFee: Number(this.doctorForm.value.consultationFee),
      yearsExperience: Number(this.doctorForm.value.yearsExperience),
    };

    console.log("FINAL PAYLOAD:", payload);

    this.doctorService.registerDoctor(payload).subscribe({
      next: (res) => {
        console.log('Success:', res);
        alert('Doctor registered successfully'); //add//
      },
      error: (err) => {
        console.error('Error:', err);
        
        alert('API failed');
      },
    });
    

  //    this.doctorService.registerUser(payload).subscribe({
  //   next: (res) => {
  //     console.log('Success:', res);
  //     this.successMsg = "Registration successful";
  //     this.errorMsg = "";
  //   },
  //   error: (err) => {
  //     console.error('Error:', err);
  //     this.errorMsg = "Registration failed";
  //   }
  // });
  }
}
