import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RequestService } from '../services/request.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private request: RequestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return of(this.router.createUrlTree(['/login']));
    }

    return this.request
      .get<{ id: number; message: string }>('api/auth/verify')
      .pipe(
        map(() => true),
        catchError(() =>
          of(this.router.createUrlTree(['/login']))
        )
      );
  }
}
