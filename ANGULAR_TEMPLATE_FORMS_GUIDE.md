# Angular Template-Driven Forms Complete Guide

## What are Template-Driven Forms?

Template-Driven Forms are Angular's approach to form handling where the form logic is primarily defined in the template (HTML) rather than in the component class. They use Angular's built-in directives like `ngModel`, `ngForm`, and form validation directives.

## Key Concepts

### 1. **Form Structure**
- Forms are wrapped in `<form>` elements
- Angular automatically creates a `FormGroup` when it encounters a `<form>` tag
- Each form control (input, select, textarea) becomes a `FormControl`

### 2. **Two-Way Data Binding with `ngModel`**
- `ngModel` creates a two-way binding between the form control and a component property
- It automatically creates a `FormControl` for each form element

### 3. **Form Validation**
- Built-in validators like `required`, `minlength`, `maxlength`, `pattern`
- Custom validation through template expressions
- Visual feedback for validation states

## Setup Requirements

### Import FormsModule
```typescript
// app.config.ts (for standalone components)
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations()
    // FormsModule is automatically available in Angular 17+
  ]
};
```

## Complete Working Example

### 1. Component Class (`user-form.component.ts`)
```typescript
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

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
      
      // Here you would typically send data to a service
      // this.userService.createUser(this.user).subscribe(...)
      
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
}
```

### 2. Template (`user-form.component.html`)
```html
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

    <!-- Terms and Conditions -->
    <div class="form-section">
      <h3>Preferences</h3>
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

## Key Concepts Explained

### 1. **Template Reference Variables**
```html
<!-- #userForm creates a reference to the NgForm instance -->
<form #userForm="ngForm">

<!-- #firstName creates a reference to the NgModel instance -->
<input #firstName="ngModel" [(ngModel)]="user.firstName" name="firstName">

<!-- Access form properties -->
<p>Form valid: {{userForm.valid}}</p>
<p>First name valid: {{firstName.valid}}</p>
```

### 2. **Two-Way Data Binding with ngModel**
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

### 3. **Form Validation States**
Each form control has these properties:
- `valid` / `invalid`: Whether the control passes validation
- `touched` / `untouched`: Whether the user has interacted with the control
- `dirty` / `pristine`: Whether the control value has changed
- `errors`: Object containing validation errors

### 4. **Built-in Validators**
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

### 5. **Validation Error Handling**
```html
<input 
  [(ngModel)]="user.firstName" 
  name="firstName"
  #firstName="ngModel"
  required
  minlength="2"
  class="form-control"
  [class.is-invalid]="firstName.invalid && firstName.touched"
>

<div class="invalid-feedback" *ngIf="firstName.invalid && firstName.touched">
  <div *ngIf="firstName.errors?.['required']">First name is required.</div>
  <div *ngIf="firstName.errors?.['minlength']">First name must be at least 2 characters.</div>
</div>
```

### 6. **Form Submission**
```typescript
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
```

## Advanced Features

### 1. **Dynamic Form Fields**
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

### 2. **Conditional Validation**
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

### 3. **Custom Validation**
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

## Best Practices

### 1. **Always include the `name` attribute**
```html
<!-- Good -->
<input [(ngModel)]="user.firstName" name="firstName">

<!-- Bad - will cause issues -->
<input [(ngModel)]="user.firstName">
```

### 2. **Use template reference variables for validation**
```html
<input 
  [(ngModel)]="user.firstName" 
  name="firstName"
  #firstName="ngModel"
  required
  [class.is-invalid]="firstName.invalid && firstName.touched"
>
```

### 3. **Check form validity before submission**
```typescript
onSubmit(form: NgForm) {
  if (form.valid) {
    // Process form
  } else {
    // Show validation errors
    this.markFormGroupTouched(form);
  }
}
```

### 4. **Provide user feedback**
```html
<div class="invalid-feedback" *ngIf="firstName.invalid && firstName.touched">
  <div *ngIf="firstName.errors?.['required']">This field is required.</div>
  <div *ngIf="firstName.errors?.['minlength']">Minimum length is 2 characters.</div>
</div>
```

### 5. **Use CSS classes for visual feedback**
```css
.form-control.is-valid {
  border-color: #28a745;
  background-color: #f8fff9;
}

.form-control.is-invalid {
  border-color: #dc3545;
  background-color: #fff8f8;
}
```

## Common Patterns

### 1. **Form Reset**
```typescript
resetForm(form: NgForm) {
  form.resetForm();
  this.user = {
    firstName: '',
    lastName: '',
    email: '',
    // ... reset all properties
  };
}
```

### 2. **Mark All Fields as Touched**
```typescript
markFormGroupTouched(form: NgForm) {
  Object.keys(form.controls).forEach(key => {
    const control = form.controls[key];
    control.markAsTouched();
  });
}
```

### 3. **Handle Checkbox Arrays**
```typescript
onInterestChange(event: any, value: string) {
  if (event.target.checked) {
    if (!this.user.interests.includes(value)) {
      this.user.interests.push(value);
    }
  } else {
    this.user.interests = this.user.interests.filter(interest => interest !== value);
  }
}
```

## When to Use Template-Driven Forms

### **Use Template-Driven Forms when:**
- Simple forms with basic validation
- Quick prototyping
- Forms with straightforward logic
- Small to medium-sized forms
- When you prefer declarative approach

### **Consider Reactive Forms when:**
- Complex forms with dynamic validation
- Forms that change based on user input
- Large forms with many fields
- When you need programmatic form control
- When you prefer imperative approach

## Summary

Template-Driven Forms in Angular provide a simple and intuitive way to handle forms using HTML templates and Angular directives. They are perfect for:

1. **Simple forms** with basic validation
2. **Quick prototyping** and development
3. **Declarative approach** to form handling
4. **Easy to understand** for developers familiar with HTML forms

The key components are:
- `ngModel` for two-way data binding
- Template reference variables for accessing form state
- Built-in validators for form validation
- CSS classes for visual feedback
- Form submission handling with validation checks

This approach makes forms easy to create and maintain while providing all the necessary functionality for most use cases. 
