import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class StoreService {
  apiUrl = environment.apiUrl
  constructor(
    private http: HttpClient
  ) { }

  getItems(endpoint: string): Promise<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`).toPromise();
  }

  detailItem(url: string): Promise<any> {
    return this.http.get(`${url}`).toPromise()
  }

  setItem(data: any, endpoint: string): Promise<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}/`, data).toPromise();
  }

  updatItem(newData: any): Promise<any> {
    return this.http.patch(`${newData.url}`, newData).toPromise();
  }

  delItem(url: string): Promise<any> {
    return this.http.delete(`${url}`).toPromise();
  }

}
