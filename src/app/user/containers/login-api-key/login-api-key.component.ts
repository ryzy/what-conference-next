import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StitchServiceError } from 'mongodb-stitch-browser-sdk';
import { User } from '../../../core/model/user';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-api-key',
  templateUrl: './login-api-key.component.html',
  styleUrls: ['./login-api-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginApiKeyComponent implements OnInit {
  public successMsg: string = '';
  public errorMsg: string = '';

  public constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    const apiKey = this.route.snapshot.params && this.route.snapshot.params.apiKey;
    if (apiKey) {
      this.authService.loginWithUserApiKey(apiKey).subscribe(
        (u) => {
          const user = User.fromStitch(u);
          this.successMsg = 'Logged in as ' + user.email;
          this.cdRef.markForCheck();
        },
        (e: Error) => {
          this.errorMsg = e.message;
          this.cdRef.markForCheck();
        },
      );
    }
  }
}
