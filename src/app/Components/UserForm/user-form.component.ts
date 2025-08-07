import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  imports:[FormsModule,CommonModule]
})
export class UserFormComponent {
  // Form data model
  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: null as number | null,
    gender: '',
    interests: [] as string[],
    newsletter: false,
    terms: false
  };

  // Available options for select dropdowns
  genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  interestOptions = [
    { value: 'sports', label: 'Sports' },
    { value: 'music', label: 'Music' },
    { value: 'reading', label: 'Reading' },
    { value: 'travel', label: 'Travel' },
    { value: 'cooking', label: 'Cooking' }
  ];

  // Form submission handler
  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form submitted successfully!');
      console.log('Form data:', this.user);
      console.log('Form object:', form);

      // Here you would typically send data to a service
      // this.userService.createUser(this.user).subscribe(...)

      // Show success message
      alert('Form submitted successfully! Check console for details.');
    } else {
      console.log('Form is invalid!');
      this.markFormGroupTouched(form);
      alert('Please fix the validation errors before submitting.');
    }
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(form: NgForm) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }

  // Custom validation method
  validateAge(age: number | null): boolean {
    return age !== null && age >= 18 && age <= 100;
  }

  // Handle interest checkbox changes
  onInterestChange(event: any, value: string) {
    if (event.target.checked) {
      if (!this.user.interests.includes(value)) {
        this.user.interests.push(value);
      }
    } else {
      this.user.interests = this.user.interests.filter(interest => interest !== value);
    }
  }

  // Reset form
  resetForm(form: NgForm) {
    form.resetForm();
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: null,
      gender: '',
      interests: [],
      newsletter: false,
      terms: false
    };
  }

  // Get form validation status
  getFormStatus(form: NgForm) {
    return {
      valid: form.valid,
      invalid: form.invalid,
      dirty: form.dirty,
      pristine: form.pristine,
      touched: form.touched,
      untouched: form.untouched
    };
  }
}
