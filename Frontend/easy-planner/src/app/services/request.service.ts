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

  get<T>(endpoint: string, showSuccessToast: boolean = false): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${endpoint}`).pipe(
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

  post<T extends ApiResponse>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      tap((response) => showSuccessToast && this.log(response.message)),
      catchError(this.handleError.bind(this)),
    );
  }

  put<T extends ApiResponse>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      tap((response) => showSuccessToast && this.log(response.message)),
      catchError(this.handleError.bind(this)),
    );
  }

  patch<T extends ApiResponse>(
    endpoint: string,
    data: any,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}/${endpoint}`, data).pipe(
      tap((response) => showSuccessToast && this.log(response.message)),
      catchError(this.handleError.bind(this)),
    );
  }

  delete<T extends ApiResponse>(
    endpoint: string,
    showSuccessToast: boolean = false,
  ): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${endpoint}`).pipe(
      tap((response) => showSuccessToast && this.log(response.message)),
      catchError(this.handleError.bind(this)),
    );
  }
}

export interface ApiResponse {
  message: string;
}
