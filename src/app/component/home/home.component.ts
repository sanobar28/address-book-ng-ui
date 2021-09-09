import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Addressbook } from 'src/app/model/addressbook';
import { HttpService } from 'src/app/service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/service/data.service';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private httpService: HttpService,  
    private router: Router,
    private snackBar: MatSnackBar,
    private dataService: DataService, 
  ) { }


  public personCount: number = 10;
  public addressbookList: Addressbook[] = [];
  message: string;


  ngOnInit(): void {
    this.httpService.getAddressBook().subscribe(responce => {
      this.addressbookList = responce.data;
      console.log(responce);

      this.personCount = this.addressbookList.length;
      console.log(this.addressbookList.length);
    });
  }

  /**
   * To delete contact details by id 
   * @param id contact id
   */
   remove(id: number) {
    this.httpService.deletePersonDetails(id).subscribe(data => {
      console.log(data);
      this.message= "Contact Deleted Successfully";
      this.openSnackBar(this.message, "CLOSE")
      this.ngOnInit();
    });
  }

  /**
   * To update contact by id
   * @param addressbook 
   */
  update(addressbook: Addressbook){
    this.dataService.changeAddressBook(addressbook);
    this.router.navigateByUrl('/edit/' + addressbook.id)
  }

  /**
   * 
   * @param message opens snackbar message on submit form
   * @param action 
   */
   openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
