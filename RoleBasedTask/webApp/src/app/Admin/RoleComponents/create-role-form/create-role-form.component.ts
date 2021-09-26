import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { RolesService } from 'src/app/services/roles.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-role-form',
  templateUrl: './create-role-form.component.html',
  styleUrls: ['./create-role-form.component.css']
})
export class CreateRoleFormComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  patterns: any = [];

  roleForm: FormGroup;
  constructor(private fb: FormBuilder,
    private rolesService: RolesService, private router: Router) { }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      modules: this.fb.array([])
    });
  }

  addPrivillegesFormGroup(moduleIndex): FormGroup {
    this.patterns[moduleIndex].push([]);
    return this.fb.group({
      pattern: [[],[Validators.required,Validators.pattern('[A-Za-z0-9_].*[*.]')]],
      privilleges: ['']
    })
  }

  addModuleFormGroup(): FormGroup {
    return this.fb.group({
      moduleName: [''],
      privilleges: this.fb.array([this.addPrivillegesFormGroup(this.modules.length)])
    })
  }


  // This function is responsible for adding the module
  addModule() {
    this.patterns.push([]);
    this.modules.push(this.addModuleFormGroup());
  }

  // This function is responsible for adding the module privillege
  addPrivillege(moduleIndex) {
    const modulePrivilleges = this.getSpecificModule(moduleIndex).get('privilleges');
    (<FormArray>modulePrivilleges).push(this.addPrivillegesFormGroup(moduleIndex));
  }

  // This function is responsible for deleteing the privillege
  deleteModule(moduleIndex){
    // Remove module
    this.modules.removeAt(moduleIndex);
    this.patterns.splice(moduleIndex,1);
  }

  // This function is responsible for deleteing the privillege
  deletePrivillege(moduleIndex,privillegesIndex){
    // Get privilleges array
    const modulePrivilleges = this.getSpecificModule(moduleIndex).get('privilleges');

    // if privilleges length is 1 then show alert message and return
    if((<FormArray>modulePrivilleges).length==1){
      alert("There must be at least one privillege");
      return ;
    }
    
    // Remove Module privillege
    (<FormArray>modulePrivilleges).removeAt(privillegesIndex);
    this.patterns[moduleIndex].splice(privillegesIndex,1);
  }

  // Getters for all the fields
  get name() {
    return this.roleForm.get('name');
  }

  get description() {
    return this.roleForm.get('description');
  }

  get modules() {
    return this.roleForm.get('modules') as FormArray;
  }

  // This function is responsible for getting specific module
  getSpecificModule(moduleIndex) {
    return (<FormArray>this.roleForm.get('modules')).controls[moduleIndex];
  }

  getSpecificPrivillege(moduleIndex,privillegesIndex){
    return (<FormArray>this.getSpecificModule(moduleIndex).get("privilleges")).controls[privillegesIndex];
  }

  // This function is responsible for updating the module privilleges
  updateModulePrivilleges(moduleIndex, privillegesIndex) {
    // Get modules
    const allModules = (<FormArray>this.roleForm.get('modules'));
    // Get that module privilleges
    const modulePrivilleges = (<FormArray>allModules.at(moduleIndex).get('privilleges'));
    // Update specific privillege's pattern
    (<FormGroup>modulePrivilleges.controls[privillegesIndex]).controls['pattern'].setValue(this.patterns[moduleIndex][privillegesIndex]);
  }

  // This function is responsible for adding the pattern in the specific module's privilleges
  addPattern(event: MatChipInputEvent, moduleIndex, privillegesIndex): void {
    const input = event.input;
    const value = event.value;
    
    if(this.getSpecificPrivillege(moduleIndex,privillegesIndex).get('pattern').hasError('pattern')){
      return;
    }

    // Add our pattern
    if ((value || '').trim()) {
      this.patterns[moduleIndex][privillegesIndex].push(value.trim());
    }

    // Update the module privilleges
    this.updateModulePrivilleges(moduleIndex, privillegesIndex);

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  // This function is responsible for removing the pattern from specific module's privilleges
  removePattern(pattern: any, moduleIndex, privillegesIndex): void {
    // Find index
    const index = this.patterns[moduleIndex][privillegesIndex].indexOf(pattern);

    // If index is there then remove it
    if (index >= 0) {
      this.patterns[moduleIndex][privillegesIndex].splice(index, 1);
    }

    // Update the module privilleges
    this.updateModulePrivilleges(moduleIndex, privillegesIndex);
  }

  // This function is responsible for checking that same module is there in the role or not
  checkModuleExistInThisRole({modules}){
    // Iterate through all modules
      for(let module of modules){
        // Check how many got matched
        const match=modules.filter(m=>m.moduleName==module.moduleName);
        //If more then one match then alert and return true
        if(match.length>1){
          alert(`${module.moduleName} module has been used more then once...`)
          return true;
        }
      }
      return false;
  }

  // This function is responsible for creating the role
  createRole(data) {
    // Checking that module in current role already exist or not
    if(this.checkModuleExistInThisRole(data)){
      return ;
    }

    //ckecking if Role & module Already Exist
    this.rolesService.checkRole(data.name)
      .subscribe(async (resData) => {
        if (resData.hits.hits.length != 0) {
          alert("The Role Which You Want To Enter Is Already Exist!!");
        } else {
          //ckecking if Module Already Exist
          let flag = false;
          for (const module of data.modules) {
            const response = await this.rolesService.checkModule(module.moduleName).toPromise();
            if (response.hits.hits.length != 0) {
              flag = true;
              alert(`Module ${module.moduleName} Already Exist In Other Role!!`);
            }

          }
          if (!flag) {
            this.rolesService.addRole(data)
              .subscribe(data => {
                console.log(data);
                setTimeout(() => {
                  this.router.navigateByUrl("/roles");
                }, 800);
              },
              err => this.router.navigate(['/oops']));
          }
        }

      },
      err => this.router.navigate(['/oops']));

  }

  //This function is responsible for handling the cancel click
  cancelClick() {
    this.router.navigate(['/roles']);
  }
}

