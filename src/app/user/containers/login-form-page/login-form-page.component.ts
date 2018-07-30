import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StitchServiceError } from 'mongodb-stitch-browser-sdk';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-form-page',
  templateUrl: './login-form-page.component.html',
  styleUrls: ['./login-form-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormPageComponent {
  public loginForm: FormGroup;

  public constructor(private authService: AuthService, private router: Router, private cdRef: ChangeDetectorRef) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.minLength(5)]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public login(): void {
    const { username, password } = this.loginForm.getRawValue();
    if (!username || !password) {
      this.loginForm.setErrors({ loginError: 'please fill the form' });
      return;
    }

    this.authService.signInWithEmailAndPassword(username, password).subscribe(
      (user) => {
        // console.log('LoginFormPageComponent login success', { user, loginForm: this.loginForm });
        this.router.navigate(['user']);
      },
      (err: StitchServiceError) => {
        // console.warn('LoginFormPageComponent: LOGIN ERROR', { err, loginForm: this.loginForm });
        this.loginForm.setErrors({ loginError: err.message });
        this.cdRef.markForCheck();
      },
    );
  }
}
