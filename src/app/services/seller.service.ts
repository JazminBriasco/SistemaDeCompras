import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Article } from '../utils/models';

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private urlSeller: string = "https://run.mocky.io/v3/c70569d3-9e72-48fb-8e77-3b8b00ceb0bc";
  private urlData: string = "https://localhost:5001/Article";
  
  constructor(private http: HttpClient) {
  }

  getSellers(): Observable<any> {
    return this.http.get<any>(this.urlSeller, { headers: new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})});
  }
  
  getData(): Observable<any> {
    return this.http.get<any>(this.urlData, { headers: new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})});
  }

  postSumProducts(producs: Article[]): Observable<any> {
    return this.http.post<any>(`${this.urlData}/add`, producs, { headers: new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})});
  }
}
