import { Component, OnInit } from '@angular/core';
import { menuList } from './menu-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sideMenu = menuList;
  collapse = false;
  isLoggedIn=false;
  constructor(  private router: Router) { }

  ngOnInit(): void {
    
  }
  
  
  toggleSidebar() {
    this.collapse = !this.collapse;
  }

  userLogout(){
    sessionStorage.clear();
    this.router.navigate(['/login'])
    .then(() => {
      window.location.reload();
    });
  }

}
