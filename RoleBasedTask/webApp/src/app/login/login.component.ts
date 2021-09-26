import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { Router } from "@angular/router";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  public loginInvalid: boolean;
  private formSubmitAttempt: boolean;
  private returnUrl: string;

  @ViewChild(FormGroupDirective, { static: false })
  formGroupDirective: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService
  ) {}
  get email() {
    return this.form.get("username");
  }
  get password() {
    return this.form.get("password");
  }
  ngOnInit() {
    this.form = this.fb.group({
      username: ["", Validators.email],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  // This function is responsible for checking that user is active or not
  checkUserActive(data) {
    return data[0]._source.status == "active";
  }

  onSubmit() {
    // Check user is admin or not
    if (
      this.form.value.username == "admin@gmail.com" &&
      this.form.value.password == "admin@123"
    ) {
      sessionStorage.setItem("isAdmin", "1");
      sessionStorage.setItem("isLogin", "1");
      this.router.navigate(["/users"]).then(() => {
        window.location.reload();
      });
    } else {
      // If user then validate user and check user's account is activated or not
      this.usersService
        .validateUser(this.email, this.password)
        .subscribe((data) => {
          if (data.length != 0) {
            if (this.checkUserActive(data)) {
              sessionStorage.setItem("isUser", "1");
              sessionStorage.setItem("isLogin", "1");
              data.forEach((user) => {
                sessionStorage.setItem("userId", user._id);
              });
              this.router.navigate(["/user-home"]).then(() => {
                window.location.reload();
              });
            } else {
              // If account not activated then alert the user
              alert(
                "Your account is deactivated, Please contact your admin..."
              );
            }
          } else {
            this.loginInvalid = true;
            setTimeout(() => this.formGroupDirective.resetForm(), 200);
          }
        });
    }
  }
}
