import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CustomActionComponent } from '../custom-action/custom-action.component';
import { NamesService } from '../../services/names.service';
@Component({
  selector: 'app-name-list',
  templateUrl: './name-list.component.html',
  styleUrls: ['./name-list.component.css']
})
export class NameListComponent implements OnInit {

  private paginationPageSize
  private paginationNumberFormatter

  constructor(private router: Router,
    private namesService: NamesService,
    private route: ActivatedRoute) {
    this.paginationPageSize = 5;
    this.paginationNumberFormatter = function (params) {
      return '[' + params.value.toLocaleString() + ']';
    };
  }

  gridApi: any;
  gridColumnApi: any
  ischildVisible: boolean = false;
  moduleName: string = '';

  columnDefs = [
    {
      headerName: 'Names', field: 'names', sortable: true, filter: true, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true,
      tooltipField: "names"
    },
    { field: 'permission', hide: true },
    { headerName: 'Actions', field: 'actions', suppressSizeToFit: false, cellRendererFramework: CustomActionComponent },
  ];

  rowData = [];


  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    }
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.moduleName = params.get('name');
    });

  }

  onPageSizeChanged() {
    const value = (<HTMLInputElement>document.getElementById('page-size')).value;
    console.log(value);
    this.gridApi.paginationSetPageSize(Number(value));
  }

  // This function is responsible for getting all the names
  getAllnames(){
    // Get all names
    this.namesService
      .getNames(this.moduleName,'')
      .subscribe((data) => {
        const namesData = [];
        if(data.length>0){
          data.forEach((d) => {
            namesData.push({
              names: d.name,
              permission: d.privilleges
  
            });
          })
        }
        this.rowData = namesData;
        // If not any name found then redirect to 404
        if(this.rowData.length==0){
          this.router.navigate(['404']);
        }
      });
  }

  //Call when userlist is ready
  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    this.getAllnames();
    params.api.paginationGoToPage(1);
  }

  // This function is responsible for providing search results
  search(keyword) {
    this.namesService
      .getNames(this.moduleName,keyword)
      .subscribe((data) => {
        const namesData = [];
        if(data.length>0){
          data.forEach((d) => {
            namesData.push({
              names: d.name,
              permission: d.privilleges
  
            });
          })
        }
        this.rowData = namesData;
        
      });
  }
}
