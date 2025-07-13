import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RequestService } from '../services/request.service';
import { AuthResponse } from '../models/global.model';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private request: RequestService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const raw = localStorage.getItem('currentUser');
    if (!raw) {
      return of(this.router.createUrlTree(['/login']));
    }

    let user: AuthResponse;
    try {
      user = JSON.parse(raw);
    } catch {
      return of(this.router.createUrlTree(['/not-authorized']));
    }

    return this.request
      .get<{ id: number; message: string }>('api/auth/verify')
      .pipe(
        map(() => {
          return user.roles.includes('ROLE_ADMIN')
            ? true
            : this.router.createUrlTree(['/not-authorized']);
        }),
        catchError(() => of(this.router.createUrlTree(['/login']))),
      );
  }
}
