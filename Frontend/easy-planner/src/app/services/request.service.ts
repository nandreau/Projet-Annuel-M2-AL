import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) {}

  private handleError(error: any): Observable<never> {
    this.messageService.add({
      severity: 'error',
      summary: 'Erreur',
      detail: error.error.message,
    });
    throw error;
  }

  private log(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Succès',
      detail: message,
    });
  }

  private getAuthOptions(): { headers: HttpHeaders } {
    const token = localStorage.getItem('accessToken') || '';
    return { headers: new HttpHeaders({ 'x-access-token': token }) };
  }


  get<T>(endpoint: string, showSuccessToast: boolean = false): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`, this.getAuthOptions()).pipe(
      tap((_) => showSuccessToast && this.log('Fetched data')),
      catchError(this.handleError.bind(this)),
    );
  }

  download(
    endpoint: string,
    showSuccessToast: boolean = false,
  ): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/${endpoint}`, { responseType: 'blob' })
      .pipe(
        tap((_) => showSuccessToast && this.log('Fetched data')),
        catchError(this.handleError.bind(this)),
      );
  }

  post<T>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data, this.getAuthOptions()).pipe(
      tap((response: any) => {
        if (showSuccessToast && response?.message) {
          this.log(response.message);
        }
      }),
      catchError(this.handleError.bind(this)),
    );
  }

  put<T>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data, this.getAuthOptions()).pipe(
      tap((response: any) => {
        if (showSuccessToast && response?.message) {
          this.log(response.message);
        }
      }),
      catchError(this.handleError.bind(this)),
    );
  }

  patch<T>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data, this.getAuthOptions()).pipe(
      tap((response: any) => {
        if (showSuccessToast && response?.message) {
          this.log(response.message);
        }
      }),
      catchError(this.handleError.bind(this)),
    );
  }

  delete<T>(
    endpoint: string,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`, this.getAuthOptions()).pipe(
      tap((response: any) => {
        if (showSuccessToast && response?.message) {
          this.log(response.message);
        }
      }),
      catchError(this.handleError.bind(this)),
    );
  }
}