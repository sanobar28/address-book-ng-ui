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
import { RxReactiveFormsModule, RxwebValidators } from "@rxweb/reactive-form-validators"



@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {


  public addressbook: Addressbook = new Addressbook;
  public addressBookFormGroup: FormGroup;
  message: string;

  states: Array<any> = [];
  stateDetails: Array<any> = [];
  cities: Array<any> = [];




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
    private addressbookList: HomeComponent,
  ) {
    this.addressBookFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, , Validators.pattern("^[A-Z][a-zA-z\\s]{2,}$")]),
      phone: new FormControl('', [Validators.required, , Validators.pattern("^[7-9][0-9]{9}$")]),
      address: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9\\s]{3,}$")]),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
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
    this.getState();

    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.addressBookFormGroup.controls['phone'].disable();
      this.dataService.currentAddressBook.subscribe(addressbook => {
        if (Object.keys(addressbook).length !== 0) {
          this.addressBookFormGroup.patchValue({
            name: addressbook.name,
            phone: addressbook.phone,
            address: addressbook.address,
            zip: addressbook.zip,
            state: addressbook.state,
            city: addressbook.city
          });
        }
      });
    }
  }


  /**
   * Method to get state and there cities and as array
   */
  getState(): void {
    this.httpService.getStateDetails().subscribe(data => {
      this.stateDetails = data.data;
      console.log(this.stateDetails);
      for (let i = 0; i < this.stateDetails.length; i++) {
        this.states.push(this.stateDetails[i]?.name);
      }
    });
  }


  /**
   * When user selects state, this method will render city names belongs
   * to selected state. 
   * @param state  state name selected by user
   */
  cityList(state) {
    for (let i = 0; i < this.stateDetails.length; i++) {
      if (this.stateDetails[i]?.name === state) {
        this.cities = this.stateDetails[i]?.city;
      }
    }
  }



  /**
   * At start form will set value  of city empty. And when user selects state it 
   * will show city list belongs to selected state.
   * @param state 
   */
  getCity(state) {
    this.addressBookFormGroup.get('city').setValue("");
    this.cityList(state);
  }



  /**
     * Submit form method in which it is checking user input validations errors.
     * If there are errors it will pop up mat snackbar with error message.
     * It will check while submitting form that it is request for update form or else it will submit 
     * new data. 
     */
  onSubmit(): void {

    this.addressBookFormGroup.controls['phone'].enable();

    this.addressbook = this.addressBookFormGroup.value;

    if (this.addressBookFormGroup.invalid) {
      this.openSnackBar("Please enter all details", 'CLOSE');
    } else {
      if (this.activatedRoute.snapshot.params['id'] != undefined) {
        this.httpService.updatePersonDetails(this.activatedRoute.snapshot.params['id'], this.addressbook).subscribe(response => {
          console.log(response);
          this.router.navigateByUrl('/home');
          this.openSnackBar("Contact Updated Successfully", "CLOSE");
        });
      }
      else {
        this.httpService.addAddressBook(this.addressbook).subscribe(response => {
          console.log(response);
          this.router.navigateByUrl('/home');
          this.openSnackBar("Form submitted Successfully", "CLOSE");
        }, error => this.openSnackBar("Contact already exist!", "CLOSE"));
      }
    }
  }

}