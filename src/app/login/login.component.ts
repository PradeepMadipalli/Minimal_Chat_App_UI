import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { strongPassword } from '../shared/password-valid.validator';
import { AuthService } from '../services/auth.service';
import { Router, mapToCanActivate } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { ConfigService } from '../services/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  username: string;
  password: string;
  loginFrom: FormGroup;
  responseData: any;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService,
    private config:ConfigService,private toastr:ToastrService) { }
  ngOnInit() {
    this.loginFrom = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), strongPassword()]]
    });
  }
  onSubmit() {
    this.authService.login(this.loginFrom.value).subscribe(
      data => {
        const token = this.config.getToken();
    
        this.responseData = data;
        sessionStorage.setItem("Profile", this.responseData.profiles);
        sessionStorage.setItem("Token", this.responseData.token);
        sessionStorage.setItem("userid", this.responseData.profiles.uId)
        sessionStorage.setItem("userid", this.responseData.profiles.uId)
        this.router.navigate(['/chat']);


      },
      error => {
        this.toastr.error('Error fetching data:', error);
      }
    );

  }
}
