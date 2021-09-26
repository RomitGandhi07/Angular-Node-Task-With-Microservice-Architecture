import { AbstractControl } from '@angular/forms';

export function PasswordValidator(control: AbstractControl): {[key:string]:boolean}| null {
 
    const password = control.get("password");
    const confirm = control.get("confirmPassword");
 
    if(password.pristine || confirm.pristine)
    {
        return null;
    }

    return password && confirm && password.value !== confirm.value ?
        {'misMatch' : true } : 
        null;
    
  }
 