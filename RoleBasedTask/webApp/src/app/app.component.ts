import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'webApp';
  isLoggedInAdmin=false;
  isLoggedInUser=false;
  ngOnInit() {
    if(sessionStorage.getItem('isLogin') && sessionStorage.getItem('isUser')){
      this.isLoggedInUser=true;
    }
    if(sessionStorage.getItem('isLogin') && sessionStorage.getItem('isAdmin')){
      this.isLoggedInAdmin=true;
    }
    
  } 
  

 
}
