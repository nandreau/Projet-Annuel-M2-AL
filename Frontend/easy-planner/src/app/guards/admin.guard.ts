// src/app/guards/admin.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthResponse } from '../models/global.model';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return this.router.createUrlTree(['/login']);

    try {
      const user = JSON.parse(raw) as AuthResponse;
      if (user.roles.includes('ROLE_ADMIN')) {
        return true;
      }
    } catch { }

    return this.router.createUrlTree(['/not-authorized']);
  }
}
