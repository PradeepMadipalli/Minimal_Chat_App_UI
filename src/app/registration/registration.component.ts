import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { strongPassword } from '../shared/password-valid.validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {

  username: string;
  password: string;
  myForm: FormGroup;
  responseData: any;

  constructor(private formbuilder:FormBuilder,private authService:AuthService,private toastr:ToastrService) {
   
    
  }
  ngOnInit(): void {
    this.myForm = this.formbuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), strongPassword()]]
    });
  }
  onSubmit() {
    console.log("log");
    console.log(this.myForm.value);
     this.authService.register(this.myForm.value).subscribe(
      data => {
        this.responseData = data;
        this.toastr.success("registration Success");
      },
      error => {
        this.toastr.error('Error fetching data:', error);
      }
    );
  }
}
