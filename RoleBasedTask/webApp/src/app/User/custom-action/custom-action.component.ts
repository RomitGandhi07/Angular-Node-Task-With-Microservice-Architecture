import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-action',
  templateUrl: './custom-action.component.html',
  styleUrls: ['./custom-action.component.css']
})
export class CustomActionComponent  {
  isEdit:boolean=false;
  isDelete:boolean=false;
  constructor() { }
  permission:string;
  agInit(params) {
    console.log(params.data.permission);
    this.permission=params.data.permission;
    this.setPermissions();
  }

  // This function is responible for set the permissions in variable
  setPermissions(){
    if(this.permission.includes("All")){this.isDelete=this.isEdit=true; return;}
    this.isDelete=this.permission.includes("Delete");
    this.isEdit=this.permission.includes("Update");
  }
}
