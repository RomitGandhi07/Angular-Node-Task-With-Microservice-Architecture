
import { Component, OnInit, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import {FormBuilder, FormGroup,Validators } from '@angular/forms';
import { Router,ActivatedRoute, ParamMap } from '@angular/router';
import { PasswordValidator } from '../../../validators/password.validator';
import { RolesService } from 'src/app/services/roles.service';
import { UsersService } from 'src/app/services/users.service';



@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})
export class AddEditUserComponent implements OnInit {
  constructor(private fb:FormBuilder,
              private router:Router,
              private rolesService:RolesService,
              private usersService:UsersService,
              private route: ActivatedRoute,
              private resolver: ComponentFactoryResolver) { }

  userForm:FormGroup;
  isAdd:boolean=false;
  isEdit:boolean=false;
  roleList: string[] = [];
  userId:string;
  hasError:boolean=false;

  // Email regex
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
  hide = true;

  // Getters of form fields
  get roles(){
    return this.userForm.get('roles');
  }
  get userName(){
    return this.userForm.get('userName');
  }
  get firstName(){
    return this.userForm.get('firstName');
  }
  get lastName(){
    return this.userForm.get('lastName');
  }
  get email(){
    return this.userForm.get('email');
  }
  get password(){
    return this.userForm.get('password');
  }
  get confirmPassword(){
    return this.userForm.get('confirmPassword');
  }
  get status(){
    return this.userForm.get('status');
  }

  // This function is responsible for getting all the roles
  getRoles(){
    // Get all the roles and then from that extract only role id & name and save it into roleList
    this.rolesService.getRoles()
      .subscribe(data=> this.roleList=this.rolesService.getRolesName(data),
                 error => {
                            this.hasError=true;
                            this.router.navigate(['/oops']);
                          });
  }

  ngOnInit() {
    // Get all roles
    this.getRoles();
    
    // Make form
    this.userForm = this.fb.group({
      userName:['',[Validators.required]],
      firstName:['',[Validators.required]],
      lastName:['',[Validators.required]],
      email:['',[Validators.required, Validators.pattern(this.emailRegx)]],
      password:['',[Validators.required,Validators.minLength(6)]],
      confirmPassword:['',[Validators.required]],
      roles:[[]],
      status:['',[Validators.required]],
    },{validator: PasswordValidator});

    if(sessionStorage.getItem('isAdd'))
    {
      this.isAdd=true;
    }
    if(sessionStorage.getItem('isEdit')){
      // Set is edit to true
      this.isEdit=true;

      // Get id of the user
      this.route.paramMap.subscribe((params:ParamMap)=>{
        this.userId=params.get('id');
      });  
      
      // Get details of the user and set it to form fields and if user is not there then send 404
      this.usersService.getSpecificUsers(this.userId)
        .subscribe(data=>{
          // Set values to fields
          this.userForm.patchValue({
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            status: data.status
          });
          this.userForm.get('email').disable();
          this.userForm.get('roles').setValue(data.roles);
          
        },
        // If error navigate to 404
        error =>{
            if(!this.hasError)this.router.navigate(['/404']);
          })

    }
  }

  //Change detection Multi Select Role Field
  onRoleRemoved(role: string) {
    const Roles = this.roles.value as string[];
    this.removeFirst(Roles, role);
    this.roles.setValue([""]); 
    this.roles.setValue(Roles); 
  }

  //Remove role from roles array
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  clearAll(){
    this.isAdd=false;
    this.isEdit=false;
    sessionStorage.removeItem('isAdd');
    sessionStorage.removeItem('isEdit');
    sessionStorage.removeItem('user');
  }

  //After Submitting the form
  submit(data){
    if(sessionStorage.getItem('isAdd')){

      //ckeck if user already exist
      this.usersService.checkUser(data.email)
        .subscribe(resData=>{
          if(resData.length != 0)
          {
            alert("User Already Exist");
          }else{
            //Add the user
            this.usersService.addUser(data)
            .subscribe(data=> {
              this.clearAll();
              setTimeout(() => {
                this.router.navigateByUrl("/users");
              }, 800);
            },
            err => this.router.navigate(['/oops']));
          }

        });
               
    }
    else{
      //Edit user
      this.usersService.updateUser(data,this.userId)
      .subscribe(data=> {
        this.clearAll();
        setTimeout(() => {
          this.router.navigateByUrl("/users");
        }, 800);
      },
      err => this.router.navigate(['/oops']));
    }
       
  }

  // This function is responsible for handling the cancle button
  cancelClick(){
    this.clearAll();
    this.router.navigate(['/users']);
  }
 

}