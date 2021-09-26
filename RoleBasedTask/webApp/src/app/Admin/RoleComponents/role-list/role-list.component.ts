import { Component, OnInit } from '@angular/core';
import { CustomcellComponent } from '../customcell/customcell.component';
import { Router } from '@angular/router';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {
  private paginationPageSize
  private paginationNumberFormatter

  constructor(private router: Router, private rolesService: RolesService) {
    this.paginationPageSize = 5;
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
   }
  gridApi: any;
  gridColumnApi: any
  ischildVisible: boolean = false;


  columnDefs = [
    {
      headerName: 'Roles', field: 'roles', sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,
      tooltipField: "roles"
    },
    { headerName: 'Description', field: 'description',filter: true, tooltipField: "description" },
    { field: "id", hide: true },
    { headerName: 'Actions', field: 'actions', suppressSizeToFit: false, cellRendererFramework: CustomcellComponent },
  ];

  rowData = [{}];


  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    sessionStorage.removeItem('isAdd');
    sessionStorage.removeItem('isEdit');
    sessionStorage.removeItem('user');

  }

  // This function is responsible for getting all the rows
  getAllroles(){
    this.rolesService
      .getRoles()
      .subscribe((data) => {

        const rolesData = [];
        data.hits.hits.forEach((d) => {
          rolesData.push({
            id: d._id,
            roles: d._source.name,
            description: d._source.description
          });
        })
        this.rowData = rolesData;
        
      });
  }

  onPageSizeChanged() {
    const value=(<HTMLInputElement>document.getElementById('page-size')).value;
    this.gridApi.paginationSetPageSize(Number(value));
    }

  //Call when userlist is ready
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    this.getAllroles();
    params.api.paginationGoToPage(1);
  }

  // This function is responsible for searching from table
  search(keyword){
    // If no keyword then get all users
    if(!keyword){
      this.getAllroles();
      return;
    }

    // Get searched results
    this.rolesService
      .searchKeyword(keyword)
      .subscribe((data) => {

        const rolesData = [];
        data.hits.hits.forEach((d) => {
          rolesData.push({
            id: d._id,
            roles: d._source.name,
            description: d._source.description
          });
        })
        this.rowData = rolesData;
        
      });
  }

  //Create New Role
  createUser() {
    this.router.navigate(['/roles/addRole']);
  }


}
