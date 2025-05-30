import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private states: { [key: string]: any } = {};
  private stateChangeSubjects: { [key: string]: Subject<{ value: any, params: any }> } = {};

  getState(stateName: string): any {
    return this.states[stateName];
  }

  setState(stateName: string, value: any): void {
    if (!this.stateChangeSubjects[stateName]) {
      this.stateChangeSubjects[stateName] = new Subject<{ value: any, params: any }>();
    }
    this.states[stateName] = value;
    this.stateChangeSubjects[stateName].next({ value, params: null });
  }

  updateStateWithParams(stateName: string, value: any, params: any): void {
    if (!this.stateChangeSubjects[stateName]) {
      this.stateChangeSubjects[stateName] = new Subject<{ value: any, params: any }>();
    }
    this.states[stateName] = value;
    this.stateChangeSubjects[stateName].next({ value, params });
  }

  getStateChanges(stateName: string): Observable<{ value: any, params: any }> {
    if (!this.stateChangeSubjects[stateName]) {
      this.stateChangeSubjects[stateName] = new Subject<{ value: any, params: any }>();
    }
    return this.stateChangeSubjects[stateName].asObservable();
  }
}