import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Every service talks to /api through HttpClient, so without this the app
    // boots and then fails on its first request.
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      // Paging is a navigation; without this the list would keep the scroll
      // position of the page you just left.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
    ),
    provideToastr({
      positionClass: 'toast-bottom-right',
      // Our own class alongside the library's, so the styling in
      // styles/_toastr.scss can hook on without fighting specificity.
      toastClass: 'ngx-toastr app-toast',
      timeOut: 3500,
      extendedTimeOut: 1500,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      easeTime: 220,
      progressBar: true,
      progressAnimation: 'decreasing',
      closeButton: true,
      tapToDismiss: true,
      newestOnTop: true,
      // Repeating an action is normal here (adding several cards in a row), so
      // duplicates are folded into one toast with a counter instead of stacking.
      preventDuplicates: true,
      countDuplicates: true,
      resetTimeoutOnDuplicate: true,
      maxOpened: 4,
      autoDismiss: true,
    }),
  ],
};
