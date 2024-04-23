import { AbstractControl, ValidatorFn } from '@angular/forms';

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value: string = control.value;

    const hasUppercase = /[A-Z]/.test(value);

    const hasLowercase = /[a-z]/.test(value);

    const hasNumber = /\d/.test(value);

    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecialCharacter;


    return isValid ? null : { strongPassword: true };
  };
}