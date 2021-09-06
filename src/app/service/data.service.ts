import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Addressbook } from '../model/addressbook';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  
  private addressSource = new BehaviorSubject(new Addressbook());
  currentAddressBook = this.addressSource.asObservable();


  changeAddressBook(addressbook: Addressbook) {
    this.addressSource.next(addressbook);
  }

  constructor() { }
}
