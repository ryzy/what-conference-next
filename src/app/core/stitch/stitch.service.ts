import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  AnonymousCredential,
  RemoteMongoClient,
  RemoteMongoDatabase,
  Stitch,
  StitchAppClient,
  StitchAppClientConfiguration,
  StitchAuth,
  StitchUser,
} from 'mongodb-stitch-browser-sdk';

import { environment } from '../../../environments/environment';
import { isUnitTestContext } from '../core-utils';
import { User } from '../model/user';
import { HttpStitchTransport } from './http-stitch-transport';
import { DbReadyAction, SetUserAction } from '../store/app/app-actions';

@Injectable({
  providedIn: 'root',
})
export class StitchService {
  public client!: StitchAppClient;
  public auth!: StitchAuth;
  public db!: RemoteMongoDatabase;

  public constructor(private zone: NgZone, private store: Store<any>, private transport: HttpStitchTransport) {
    // Run it outside Angular, so it doesn't result with any change detection events etc...
    zone.runOutsideAngular(() => this.createStitchApp());
  }

  /**
   * Connects to MongoDB Stitch database, by authenticating anonymous user, if needed.
   * Needs to be called *before* any db.collection() query.
   *
   * Call it from root module constructor, to make sure it's called as early as possible.
   *
   * Note: for now we don't want to run it during the test, since
   * we'd need to always mock these responses... (to login and then to user profile).
   */
  public connectToDb(): void {
    if (this.auth.isLoggedIn) {
      // console.log('StitchService#loginAndEmitDbReady, isLoggedIn, nothing to do...');
      this.store.dispatch(new DbReadyAction());
    } else {
      // console.log('StitchService#loginAndEmitDbReady, logging in...');
      this.auth.loginWithCredential(new AnonymousCredential()).then((user: StitchUser) => {
        // console.log('StitchService#loginAndEmitDbReady, logged in', user);
        this.store.dispatch(new DbReadyAction());
      });
    }
  }

  /**
   * Handle Stitch authentication results from external auth providers
   * which are present in the URL (and they disappear after we call .handleRedirectResult()).
   * After that user is authenticated and the tokens are put in local storage.
   */
  public handleRedirectResultIfNeeded(): void {
    if (this.auth.hasRedirectResult()) {
      this.auth.handleRedirectResult().then((u: StitchUser) => {
        // NOTE: not sure how to handle this case.
        // Seems like callback called from `stitch.auth.addAuthListener` doesn't
        // emit full user after `handleRedirectResult()` has been called.
        // Therefore we re-emit it here.
        // TODO: this is tight coupled, must be somehow resolved...
        this.store.dispatch(new SetUserAction(User.fromStitch(u)));
      });
    }
  }

  protected createStitchApp(): void {
    // TODO: rewrite, make it configurable/injectable
    const config = new StitchAppClientConfiguration({ transport: this.transport } as any, 'local-app', '0.0.1');

    // TODO: improve creating these instances during tests...
    const stitchAppId = environment.mongo.stitchAppId + (isUnitTestContext() ? Math.random() : '');
    this.client = Stitch.initializeAppClient(stitchAppId, config);

    // Just a shortcut to StitchAuth, since it's often accessed
    this.auth = this.client.auth;

    // It's OK to get RemoteMongoDatabase *before* connecting/authenticating the client
    this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(environment.mongo.database);

    // console.log('StitchService#createStitchApp', {
    //   loggedIn: this.client.auth.isLoggedIn,
    //   hasRedirectResult: this.auth.hasRedirectResult(),
    //   user: this.client.auth.user,
    //   client: this.client,
    //   auth: this.auth,
    //   db: this.db,
    // });

    this.handleRedirectResultIfNeeded();
  }
}
