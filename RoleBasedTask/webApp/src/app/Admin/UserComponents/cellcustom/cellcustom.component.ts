import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-cellcustom',
  templateUrl: './cellcustom.component.html',
  styleUrls: ['./cellcustom.component.css']
})
export class CellcustomComponent implements OnInit {

  data: any;
  params: any;
  constructor(private router:Router,
              private usersService:UsersService) {}

  agInit(params) {
    this.params = params;
    this.data = params.value;
    
  }

  ngOnInit() {
  }
  editRow() {
    let rowData = this.params;
    let i = rowData.rowIndex;
    sessionStorage.setItem('isEdit','1');
    this.router.navigate([`/users/${rowData.data.id}`]);

  }

  deleteRow() {
    let rowData = this.params;
    const deleteConfirm = confirm(`Are You Sure ? You Want to this Delete User ${rowData.data.userName}`);
    if (deleteConfirm == true) {
    this.usersService.deleteUser(rowData.data.id)
      .subscribe(data=> {
        setTimeout(() => {
          this.router.navigateByUrl("/users");
        }, 800);
      });
    }else{
      this.router.navigate(['/users']);
    }
  } 
}
