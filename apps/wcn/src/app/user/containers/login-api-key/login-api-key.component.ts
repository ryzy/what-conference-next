import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserApiKey } from 'mongodb-stitch-browser-sdk';

import { User } from '../../../core/model/user';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Authenticate user using user api key
 * OR
 * allow authenticated user to get a new user api key
 */
@Component({
  selector: 'app-login-api-key',
  templateUrl: './login-api-key.component.html',
  styleUrls: ['./login-api-key.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginApiKeyComponent implements OnInit {
  /**
   * Current user snapshot from the store
   * If there's no user, it means we probably authenticating
   * via provided api key url param)
   */
  public currentUser: User | undefined;

  /**
   * Message after trying to authenticate user (success or error)
   */
  public message: string = '';

  /**
   * Uer API Key (as arrived from the url param... or when requested by authenticated user)
   */
  public apiKey: string | undefined;
  /**
   * User API Keys
   */
  public apiKeys: UserApiKey[] | undefined;

  public constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.authService.getUserSnapshot();

    this.apiKey = this.route.snapshot.params && this.route.snapshot.params.apiKey;
    if (this.apiKey) {
      this.authService.loginWithUserApiKey(this.apiKey).subscribe(
        (u) => {
          const user = User.fromStitch(u);
          this.message = 'Logged in as ' + user.email;
          this.cdRef.markForCheck();
        },
        (e: Error) => {
          this.message = e.message;
          this.cdRef.markForCheck();
        },
      );
    }
  }

  public createUserApiKey(): void {
    if (this.currentUser) {
      this.authService.createUserApiKey(this.currentUser.email).then((v) => {
        this.apiKey = v.key;
        this.apiKeys = undefined;
        this.cdRef.markForCheck();
      });
    }
  }

  public getUserApiKeys(): void {
    if (this.currentUser) {
      this.authService.fetchUserApiKeys().then((v) => {
        this.apiKeys = v;
        this.cdRef.markForCheck();
      });
    }
  }
}
