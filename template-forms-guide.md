# Angular Template-Driven Forms Complete Guide

## Table of Contents
1. [Basic Setup](#basic-setup)
2. [Form Structure](#form-structure)
3. [Data Binding](#data-binding)
4. [Validation](#validation)
5. [Form Submission](#form-submission)
6. [Advanced Features](#advanced-features)
7. [Best Practices](#best-practices)

## Basic Setup

### 1. Import FormsModule
```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Required for template-driven forms

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule  // Add this import
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. Component Class
```typescript
// user-form.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  // Form data model
  user = {
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
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted successfully!');
      console.log('Form data:', this.user);
      console.log('Form object:', form);
      
      // Here you would typically send data to a service
      // this.userService.createUser(this.user).subscribe(...)
    } else {
      console.log('Form is invalid!');
      this.markFormGroupTouched(form);
    }
  }

  // Helper method to mark all fields as touched
  markFormGroupTouched(form: any) {
    Object.keys(form.controls).forEach(key => {
      const control = form.controls[key];
      control.markAsTouched();
    });
  }

  // Custom validation method
  validateAge(age: number): boolean {
    return age >= 18 && age <= 100;
  }

  // Reset form
  resetForm(form: any) {
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
}
```

## Form Structure

### 3. Template with Complete Form
```html
<!-- user-form.component.html -->
<div class="form-container">
  <h2>User Registration Form</h2>
  
  <!-- Template Reference Variable: #userForm -->
  <form #userForm="ngForm" (ngSubmit)="onSubmit(userForm)" novalidate>
    
    <!-- Personal Information Section -->
    <div class="form-section">
      <h3>Personal Information</h3>
      
      <!-- First Name -->
      <div class="form-group">
        <label for="firstName">First Name *</label>
        <input 
          type="text" 
          id="firstName"
          name="firstName"
          [(ngModel)]="user.firstName"
          #firstName="ngModel"
          required
          minlength="2"
          maxlength="50"
          pattern="^[a-zA-Z\s]+$"
          class="form-control"
          [class.is-invalid]="firstName.invalid && firstName.touched"
          [class.is-valid]="firstName.valid && firstName.touched"
        >
        
        <!-- Validation Messages -->
        <div class="invalid-feedback" *ngIf="firstName.invalid && firstName.touched">
          <div *ngIf="firstName.errors?.['required']">First name is required.</div>
          <div *ngIf="firstName.errors?.['minlength']">First name must be at least 2 characters.</div>
          <div *ngIf="firstName.errors?.['maxlength']">First name cannot exceed 50 characters.</div>
          <div *ngIf="firstName.errors?.['pattern']">First name can only contain letters and spaces.</div>
        </div>
        
        <!-- Debug Info (remove in production) -->
        <small class="debug-info">
          Valid: {{firstName.valid}} | 
          Touched: {{firstName.touched}} | 
          Dirty: {{firstName.dirty}}
        </small>
      </div>

      <!-- Last Name -->
      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input 
          type="text" 
          id="lastName"
          name="lastName"
          [(ngModel)]="user.lastName"
          #lastName="ngModel"
          required
          minlength="2"
          maxlength="50"
          class="form-control"
          [class.is-invalid]="lastName.invalid && lastName.touched"
        >
        <div class="invalid-feedback" *ngIf="lastName.invalid && lastName.touched">
          <div *ngIf="lastName.errors?.['required']">Last name is required.</div>
          <div *ngIf="lastName.errors?.['minlength']">Last name must be at least 2 characters.</div>
        </div>
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">Email Address *</label>
        <input 
          type="email" 
          id="email"
          name="email"
          [(ngModel)]="user.email"
          #email="ngModel"
          required
          pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          class="form-control"
          [class.is-invalid]="email.invalid && email.touched"
        >
        <div class="invalid-feedback" *ngIf="email.invalid && email.touched">
          <div *ngIf="email.errors?.['required']">Email is required.</div>
          <div *ngIf="email.errors?.['pattern']">Please enter a valid email address.</div>
        </div>
      </div>

      <!-- Phone Number -->
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input 
          type="tel" 
          id="phone"
          name="phone"
          [(ngModel)]="user.phone"
          #phone="ngModel"
          pattern="^[\+]?[1-9][\d]{0,15}$"
          class="form-control"
          [class.is-invalid]="phone.invalid && phone.touched"
        >
        <div class="invalid-feedback" *ngIf="phone.invalid && phone.touched">
          <div *ngIf="phone.errors?.['pattern']">Please enter a valid phone number.</div>
        </div>
      </div>

      <!-- Age -->
      <div class="form-group">
        <label for="age">Age *</label>
        <input 
          type="number" 
          id="age"
          name="age"
          [(ngModel)]="user.age"
          #age="ngModel"
          required
          min="18"
          max="100"
          class="form-control"
          [class.is-invalid]="age.invalid && age.touched"
        >
        <div class="invalid-feedback" *ngIf="age.invalid && age.touched">
          <div *ngIf="age.errors?.['required']">Age is required.</div>
          <div *ngIf="age.errors?.['min']">Age must be at least 18.</div>
          <div *ngIf="age.errors?.['max']">Age cannot exceed 100.</div>
        </div>
      </div>

      <!-- Gender -->
      <div class="form-group">
        <label for="gender">Gender *</label>
        <select 
          id="gender"
          name="gender"
          [(ngModel)]="user.gender"
          #gender="ngModel"
          required
          class="form-control"
          [class.is-invalid]="gender.invalid && gender.touched"
        >
          <option *ngFor="let option of genderOptions" [value]="option.value">
            {{option.label}}
          </option>
        </select>
        <div class="invalid-feedback" *ngIf="gender.invalid && gender.touched">
          <div *ngIf="gender.errors?.['required']">Please select a gender.</div>
        </div>
      </div>
    </div>

    <!-- Interests Section -->
    <div class="form-section">
      <h3>Interests</h3>
      <div class="form-group">
        <label>Select Your Interests</label>
        <div class="checkbox-group">
          <div *ngFor="let option of interestOptions" class="checkbox-item">
            <input 
              type="checkbox" 
              [id]="option.value"
              [name]="option.value"
              [value]="option.value"
              [checked]="user.interests.includes(option.value)"
              (change)="onInterestChange($event, option.value)"
              class="form-check-input"
            >
            <label [for]="option.value" class="form-check-label">
              {{option.label}}
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences Section -->
    <div class="form-section">
      <h3>Preferences</h3>
      
      <!-- Newsletter Subscription -->
      <div class="form-group">
        <div class="checkbox-item">
          <input 
            type="checkbox" 
            id="newsletter"
            name="newsletter"
            [(ngModel)]="user.newsletter"
            class="form-check-input"
          >
          <label for="newsletter" class="form-check-label">
            Subscribe to our newsletter
          </label>
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="form-group">
        <div class="checkbox-item">
          <input 
            type="checkbox" 
            id="terms"
            name="terms"
            [(ngModel)]="user.terms"
            #terms="ngModel"
            required
            class="form-check-input"
            [class.is-invalid]="terms.invalid && terms.touched"
          >
          <label for="terms" class="form-check-label">
            I agree to the <a href="#" target="_blank">Terms and Conditions</a> *
          </label>
        </div>
        <div class="invalid-feedback" *ngIf="terms.invalid && terms.touched">
          <div *ngIf="terms.errors?.['required']">You must agree to the terms and conditions.</div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="form-actions">
      <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">
        Submit Registration
      </button>
      <button type="button" class="btn btn-secondary" (click)="resetForm(userForm)">
        Reset Form
      </button>
    </div>

    <!-- Form Status Display -->
    <div class="form-status">
      <h4>Form Status</h4>
      <p><strong>Form Valid:</strong> {{userForm.valid}}</p>
      <p><strong>Form Dirty:</strong> {{userForm.dirty}}</p>
      <p><strong>Form Touched:</strong> {{userForm.touched}}</p>
      <p><strong>Form Values:</strong></p>
      <pre>{{userForm.value | json}}</pre>
    </div>
  </form>
</div>
```

## Data Binding Explained

### 4. Understanding `ngModel`

```html
<!-- Two-way data binding -->
<input [(ngModel)]="user.firstName" name="firstName">

<!-- This is equivalent to: -->
<input [ngModel]="user.firstName" (ngModelChange)="user.firstName = $event" name="firstName">

<!-- One-way binding (read-only) -->
<input [ngModel]="user.firstName" name="firstName">

<!-- One-way binding (write-only) -->
<input (ngModelChange)="user.firstName = $event" name="firstName">
```

### 5. Template Reference Variables

```html
<!-- #userForm creates a reference to the NgForm instance -->
<form #userForm="ngForm">

<!-- #firstName creates a reference to the NgModel instance -->
<input #firstName="ngModel" [(ngModel)]="user.firstName" name="firstName">

<!-- Access form properties -->
<p>Form valid: {{userForm.valid}}</p>
<p>First name valid: {{firstName.valid}}</p>
```

## Validation

### 6. Built-in Validators

```html
<!-- Required field -->
<input required [(ngModel)]="user.email" name="email">

<!-- Minimum length -->
<input minlength="3" [(ngModel)]="user.username" name="username">

<!-- Maximum length -->
<input maxlength="50" [(ngModel)]="user.description" name="description">

<!-- Pattern matching (regex) -->
<input pattern="^[a-zA-Z0-9]+$" [(ngModel)]="user.username" name="username">

<!-- Email validation -->
<input type="email" [(ngModel)]="user.email" name="email">

<!-- Number range -->
<input type="number" min="18" max="100" [(ngModel)]="user.age" name="age">
```

### 7. Custom Validation

```typescript
// In component class
validateCustomField(value: string): boolean {
  return value && value.length > 0 && value.includes('@');
}
```

```html
<!-- In template -->
<input 
  [(ngModel)]="user.customField" 
  name="customField"
  #customField="ngModel"
  [class.is-invalid]="!validateCustomField(customField.value) && customField.touched"
>
<div class="invalid-feedback" *ngIf="!validateCustomField(customField.value) && customField.touched">
  Custom validation failed.
</div>
```

## Form Submission

### 8. Handling Form Submission

```typescript
// In component class
onSubmit(form: NgForm) {
  if (form.valid) {
    console.log('Form is valid, submitting...');
    console.log('Form data:', form.value);
    
    // Send to service
    this.userService.createUser(form.value).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.resetForm(form);
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  } else {
    console.log('Form is invalid');
    this.markFormGroupTouched(form);
  }
}

// Helper method to mark all fields as touched
markFormGroupTouched(form: NgForm) {
  Object.keys(form.controls).forEach(key => {
    const control = form.controls[key];
    control.markAsTouched();
  });
}
```

## Advanced Features

### 9. Dynamic Form Fields

```typescript
// Component class
dynamicFields = [
  { name: 'field1', label: 'Field 1', type: 'text', required: true },
  { name: 'field2', label: 'Field 2', type: 'email', required: false },
  { name: 'field3', label: 'Field 3', type: 'number', required: true }
];

user: any = {};
```

```html
<!-- Template -->
<div *ngFor="let field of dynamicFields" class="form-group">
  <label [for]="field.name">{{field.label}}</label>
  <input 
    [type]="field.type"
    [id]="field.name"
    [name]="field.name"
    [(ngModel)]="user[field.name]"
    [required]="field.required"
    class="form-control"
  >
</div>
```

### 10. Conditional Validation

```html
<!-- Show additional field only if checkbox is checked -->
<div class="form-group">
  <input type="checkbox" [(ngModel)]="showAdditionalField" name="showAdditionalField">
  <label>Show additional field</label>
</div>

<div class="form-group" *ngIf="showAdditionalField">
  <label for="additionalField">Additional Field *</label>
  <input 
    type="text" 
    id="additionalField"
    name="additionalField"
    [(ngModel)]="user.additionalField"
    #additionalField="ngModel"
    required
    class="form-control"
    [class.is-invalid]="additionalField.invalid && additionalField.touched"
  >
  <div class="invalid-feedback" *ngIf="additionalField.invalid && additionalField.touched">
    Additional field is required when checkbox is checked.
  </div>
</div>
```

## Best Practices

### 11. CSS Styling

```css
/* form.component.css */
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.is-valid {
  border-color: #28a745;
}

.invalid-feedback {
  display: block;
  color: #dc3545;
  font-size: 12px;
  margin-top: 5px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.form-status {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.debug-info {
  color: #6c757d;
  font-size: 11px;
  margin-top: 5px;
}
```

### 12. Error Handling

```typescript
// Add to component class
onInterestChange(event: any, value: string) {
  if (event.target.checked) {
    if (!this.user.interests.includes(value)) {
      this.user.interests.push(value);
    }
  } else {
    this.user.interests = this.user.interests.filter((interest: string) => interest !== value);
  }
}

// Form reset with proper typing
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
```

## Key Takeaways

1. **Template Reference Variables**: Use `#variableName="ngForm"` or `#variableName="ngModel"` to access form and control instances
2. **Two-way Binding**: `[(ngModel)]` provides automatic two-way data binding
3. **Validation States**: Access `valid`, `invalid`, `touched`, `dirty`, `pristine` properties
4. **Form Submission**: Use `(ngSubmit)` event handler
5. **CSS Classes**: Angular automatically adds classes like `ng-valid`, `ng-invalid`, `ng-touched`, `ng-dirty`
6. **Error Handling**: Check `form.valid` before submission and provide user feedback

This comprehensive guide covers all aspects of Template-Driven Forms in Angular, from basic setup to advanced features and best practices. 
