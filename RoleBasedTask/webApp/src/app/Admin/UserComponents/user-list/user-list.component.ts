import { Component, OnInit } from '@angular/core';
import { CellcustomComponent } from '../cellcustom/cellcustom.component';
import { InitialscustomComponent } from '../initialscustom/initialscustom.component';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private paginationPageSize
  private paginationNumberFormatter

  constructor(private router: Router,private usersService: UsersService) { 
    
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
      headerName: 'User Name', field: 'userName', sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,
      tooltipField: "userName", cellRendererFramework: InitialscustomComponent
    },
    { field: "firstName", hide: true },
    { field: "lastName", hide: true },
    { headerName: 'Email Address', field: 'email', filter: true, sortable: true, tooltipField: "email" },
    { field: "password", hide: true },
    { field: "confirmPassword", hide: true },
    { headerName: 'Roles', field: 'rolesName', tooltipField: 'rolesName'},
    { headerName: 'Status', field: 'status', maxWidth: 150 },
    { field: "id", hide: true },
    { headerName: 'Actions', field: 'actions', suppressSizeToFit: false, cellRendererFramework: CellcustomComponent },
  ];

  rowData = [{userName:''}];

  // This function is responsible for getting all the roles
  getUsers() {
    // Get all the roles and then from that extract only role id & name and save it into roleList
    this.usersService.getUsers()
      .subscribe(data => {
        // const {id,source}=data.hits.hits;
        data.hits.hits.forEach(user => {
          // let userData;
          user._source.id = user._id;
          this.rowData.push(user._source);
        })
      });
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    
    sessionStorage.removeItem('isAdd');
    sessionStorage.removeItem('isEdit');
    sessionStorage.removeItem('user');

  }

getAllUsers(){
  this.usersService
      .getUsers()
      .subscribe((data) => {
        const userData = [];
        data.hits.hits.forEach((d) => {
          
          userData.push({
            id: d._id,
            userName: d._source.userName,
            firstName: d._source.firstName,
            lastName: d._source.lastName,
            email: d._source.email,
            password: d._source.password,
            confirmPassword: d._source.password,
            status: d._source.status,
            rolesName: d._source.roles.toString(),
          });
        })
        this.rowData = userData;
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
    this.getAllUsers();
    params.api.paginationGoToPage(1);

  }

  // This function is responsible for searching from table
  search(keyword){
    // If no keyword then get all users
    if(!keyword){
      this.getAllUsers();
      return;
    }

    // Get searched results
    this.usersService.searchKeyword(keyword)
      .subscribe(data => {
        // If not any search matched then make row data to empty array
        if(data.hits.hits.length==0){
          this.rowData=[];
        }
        
        // Make rowdata
        data.hits.hits.forEach(user => {
          const userData = [];
          data.hits.hits.forEach((d) => {
          userData.push({
            id: d._id,
            userName: d._source.userName,
            firstName: d._source.firstName,
            lastName: d._source.lastName,
            email: d._source.email,
            password: d._source.password,
            confirmPassword: d._source.password,
            status: d._source.status,
            rolesName: d._source.roles.toString(),
          });

        })
        this.rowData = userData;
        })
      });
  }

  //Create New User
  createUser() {
    sessionStorage.setItem('isAdd', '1');
    this.router.navigate(['/users/addUser']);
  }


}
