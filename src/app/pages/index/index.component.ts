import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { first } from "rxjs/operators";
import { User } from "src/app/class/model";
import { AuthService } from "src/app/service/auth.service";

@Component({
  selector: "app-index",
  templateUrl: "index.component.html",
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  focus;
  notif = false;
  spinner = false;
  focus1;
  focus2;
  date = new Date();
  pagination = 3;
  pagination1 = 1;
  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }
  scrollToDownload(element: any) {
    element.scrollIntoView({ behavior: "smooth" });
  }
  ngOnInit() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("index-page");
    this.login()
  }

  login() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength, Validators.minLength]]
    });
  }
  get f() {
    return this.loginForm.controls;
  }

  submit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.spinner = true;
    const user = new User();
    user.username = this.f.username.value;
    user.password = this.f.password.value;
    console.log(user)
    this.authService.login(user).pipe(first()).subscribe(data => {
      console.log(data)
      if (data.token) {
        this.spinner = false
        return this.router.navigate(["/management"])
      }
    },
      error => {
        setTimeout(() => {
          this.spinner = false
          this.notif = true
        }, 5000)
      })
  }
  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("index-page");
  }
}
