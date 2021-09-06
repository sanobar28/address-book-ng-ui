import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Addressbook } from '../model/addressbook';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

baseUrl: String = "http://localhost:8080/addressbook";


  constructor(private httpClient : HttpClient) { }

  getAddressBook() : Observable<any> {
    return this.httpClient.get(this.baseUrl + "/getcontacts");
  }

  addAddressBook(body: any): Observable<any> {
    return this.httpClient.post(this.baseUrl + "/addcontact", body);
  }

  deletePersonDetails(id: number): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/deletecontact/${id}`);   
  }

  updatePersonDetails(id, addressbook: Addressbook){
    return this.httpClient.put(`${this.baseUrl}/updatecontact/${id}`, addressbook);
  }
  
  
}
