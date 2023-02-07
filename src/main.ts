import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment, env } from './environments/environment';
import { AppModule } from './app/app.module';
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';

Sentry.init({
  dsn: 'https://089d992ddd00414897bea1a665dec9fa@o1288612.ingest.sentry.io/6505807',
  integrations: [
    // Registers and configures the Tracing integration,
    // which automatically instruments your application to monitor its
    // performance, including custom Angular routing instrumentation
    new BrowserTracing({
      tracingOrigins: ['localhost/api', `https://auth-nova${env}.tic-nova.com/api`],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: environment.env === 'PROD' ? 1.0 : 0,
  sampleRate: environment.env === 'PROD' ? 1.0 : environment.env === 'LOCAL' ? 0 : 0.5,
  environment: environment.env,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
