import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { Firestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBk2krPuQyi9R_2wRpB--fhYPGsaGFz08Q",
  authDomain: "to-do-58e5a.firebaseapp.com",
  projectId: "to-do-58e5a",
  storageBucket: "to-do-58e5a.firebasestorage.app",
  messagingSenderId: "825457079560",
  appId: "1:825457079560:web:4a3b7aed8690a120e8e8bd",
  measurementId: "G-BFSETGHKP3"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(ToastrModule.forRoot()),
    { provide: Firestore, useValue: firestore }
  ]
};