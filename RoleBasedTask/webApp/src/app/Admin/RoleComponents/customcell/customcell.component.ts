import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-customcell',
  templateUrl: './customcell.component.html',
  styleUrls: ['./customcell.component.css']
})
export class CustomcellComponent implements OnInit {

  data: any;
  params: any;
  constructor(private router: Router, private rolesService: RolesService) { }

  agInit(params) {

    this.params = params;
    this.data = params.value;
  }

  ngOnInit() {
  }

  editRow() {
    const rowData = this.params;
    const roleId=rowData.data.id;
    console.log("rollId",roleId);
    this.router.navigate([`/roles/${roleId}`]);

  }

  deleteRow() {
    const rowData = this.params;
    const deleteConfirm = confirm(`Are You Sure ? You Want to  Delete Role ${rowData.data.roles}`);
    if (deleteConfirm == true) {
      this.rolesService.deleteRole(rowData.data.id,rowData.data.roles)
      .subscribe(data=> {
        setTimeout(() => {
          this.router.navigateByUrl("/roles");
        }, 800);
      });
     } else {
      this.router.navigate(['/roles']);
    }
  }
}
