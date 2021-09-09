import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Addressbook } from 'src/app/model/addressbook';
import { FormArray, FormBuilder, FormControl, Validators, FormsModule } from '@angular/forms';

import { HttpService } from '../../service/http.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from 'src/app/service/data.service';
import { HomeComponent } from '../home/home.component';
import {  RxReactiveFormsModule, RxwebValidators } from "@rxweb/reactive-form-validators"


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {


  public addressbook: Addressbook = new Addressbook;
  public addressBookFormGroup: FormGroup;
  message: string;



  /**
   * Array of strings for storing city and state names
   */
  cities: string[] = [
    "Mumbai", "Pune", "Nagpur", "Jaipur", "Udaipur", "Chennai", "Banglore", "Hydrabad", "Ahamdabad"
  ]


  states: string[] = [
    "Maharashtra", "Karnataka", "Rajasthan", "Telangana", "TamilNadu", "Gujrat"
  ]


  /**
   * Dynamically changes the selected value for city and state
   */
  selectedCity = new FormControl('');
  selectedState = new FormControl('');

  /**
   * Creating Objects and creating address book object using form builder
   * @param formBuilder 
   * @param httpService 
   * @param activatedRoute 
   * @param router 
   * @param snackBar 
   */
  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private dataService: DataService,
    private snackBar: MatSnackBar,
    private addressbookList: HomeComponent
  ) {
    this.addressBookFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, , Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      phone: new FormControl('', [Validators.required, , Validators.pattern("^[7-9][0-9]{9}$")]),
      address: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9\\s]{3,}$")]),
      city: this.selectedCity,
      state: this.selectedState,
      zip: new FormControl('', [Validators.required, , Validators.pattern("^[1-9][0-9]{5,}$")])
    })
  }

  /**
   * To show error message for invalid or missing data
   * @param controlName 
   * @param errorName  
   * @returns error message 
   */
  public checkError = (controlName: string, errorName: string) => {
    return this.addressBookFormGroup.controls[controlName].hasError(errorName);
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


  /**
    * To set previously submmitted form values while updating form data
    */
   ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] != undefined) {
      this.dataService.currentAddressBook.subscribe(addressbook => {
        if(Object.keys(this.addressbook).length !== 0) {
          this.addressBookFormGroup.patchValue({
            name:addressbook.name,
            phone:addressbook.phone,
            address:addressbook.address,
            state:addressbook.state,
            city:addressbook.city,
            zip:addressbook.zip
          });
        }
      });
    }
  }

  /**
     * Submit form method in which it is checking user input validations errors.
     * If there are errors it will pop up mat snackbar with error message.
     * It will check while submitting form that it is request for update form or else it will submit 
     * new data. 
     */
  onSubmit(): void {

      this.addressbook = this.addressBookFormGroup.value;
      if (this.activatedRoute.snapshot.params['id'] != undefined) {
        this.httpService.updatePersonDetails(this.activatedRoute.snapshot.params['id'], this.addressbook).subscribe(response => {
          console.log(response);
          this.router.navigateByUrl('/home');
        });
      }
      else {
        this.httpService.addAddressBook(this.addressbook).subscribe(response => {
          console.log(response);
          this.router.navigateByUrl('/home');
        }, error => this.openSnackBar("Contact already exist!", "CLOSE"));
    }

}

}