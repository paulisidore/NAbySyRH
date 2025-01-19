/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isAuthenticated(): boolean {
    const token = localStorage.getItem('nabysy_token');
    if (!token) {return false;}

    const payload = JSON.parse(atob(token.split('.')[1]));
    const isExpired = payload.exp < Date.now() / 1000;

    return !isExpired;
  }

  logout(): void {
    // Supprimez les données de session
    localStorage.removeItem('nabysy_token');
  }
}
