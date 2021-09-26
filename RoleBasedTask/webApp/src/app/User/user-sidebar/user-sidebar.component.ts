import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent implements OnInit {

  constructor( private usersService: UsersService, private router: Router) { }
  userModules=[]
  uname:string='';
  collapse=false;

  async ngOnInit() {
    // Get userid 
    this.usersService.getSpecificUsers(sessionStorage.getItem("userId"))
    .subscribe(data => {
      this.uname=data.userName;

      // Make usermodules array
      data.modules.forEach(d => {
       this.userModules.push(d.moduleName);
       const p={
         moduleName:d.moduleName,
       }
     });
    })
  }
  
  // This functino is responsible for toggle the sidebar
  toggleSidebar() {
    this.collapse = !this.collapse;
  }

  // This function is responsible for get the accessible name of that module
  getNames(module_name){
    this.router.navigate([`/module/${module_name}`])
  }

  // This function is responsible for logout from the user
  userLogout(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
    .then(() => {
      window.location.reload();
    });
  }
}
