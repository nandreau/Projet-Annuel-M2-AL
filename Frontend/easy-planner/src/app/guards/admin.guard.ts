import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const userRole = localStorage.getItem('role'); 

    if (userRole !== 'admin') {
      this.router.navigate(['/not-authorized']);
      return false;
    }

    return true;
  }
}
