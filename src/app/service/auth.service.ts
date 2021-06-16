import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../class/model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl;
  jwtLogin = environment.jwtLogin;
  jwtRefresh = environment.jwtRefresh;
  private currentUserSubject: BehaviorSubject<User>;
  private currentUser: Observable<User>;
  constructor(
    private http: HttpClient
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
  login(user: User) {
    return this.http.post<any>(`${this.apiUrl}/${this.jwtLogin}`, user)
      .pipe(
        map(response => {
          let currentUser: User;
          if (response.token) {
            currentUser = jwtDecode(response.token)
            currentUser.token = response.token
            currentUser.refreshToken = response.token
            localStorage.setItem('currentUser', JSON.stringify(currentUser))
            this.currentUserSubject.next(currentUser)
          }
          return currentUser!
        })
      )
  }
  
  logout(): void {
    localStorage.removeItem('currentUser')
    this.currentUserSubject.next(null!)
  }
  refreshToken() {
    const refreshToken = this.currentUserValue.refreshToken
    return this.http.post<any>(`${this.apiUrl}/api-token-refresh/`, { 'token': refreshToken })
      .pipe(
        map(response => {
          let currentUser!: User
          if (response.token) {
            currentUser = jwtDecode(response.token)
            currentUser.token = response.token
            currentUser.refreshToken = response.token
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            this.currentUserSubject.next(currentUser);
          }
          return currentUser
        })
      )

  }
}
