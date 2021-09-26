import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { RolesService } from 'src/app/services/roles.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-edit-role-form',
  templateUrl: './edit-role-form.component.html',
  styleUrls: ['./edit-role-form.component.css']
})
export class EditRoleFormComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  patterns: any = [];

  roleForm: FormGroup;
  roleId: string;
  roleDetails: any;
  constructor(private fb: FormBuilder,
    private rolesService: RolesService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Create Form
    this.roleForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      description: [''],
      modules: this.fb.array([])
    });

    // Get Role Id
    // this.roleId='Dd6gEHgBhLGll-wNU1yU';
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.roleId = params.get('id');
      this.setFieldvalues();
    });
  }

  setFieldvalues() {
    // Get details of role
    this.rolesService.getSpecificRole(this.roleId)
      .subscribe(data => {
        this.roleDetails = data._source;

        // Set value of name & description
        this.roleForm.patchValue({
          name: this.roleDetails.name,
          description: this.roleDetails.description
        });

        // Add Modules and it's privilleges
        this.addSetModules();

      },
      err => this.router.navigate(['/404']));
  }

  // This function is responsible for adding and setting modules and it's privilleges
  addSetModules() {
    // Loop through all modules
    this.roleDetails.modules.forEach((module, moduleIndex) => {
      // Add module & set it's name
      this.addModule();
      (<FormGroup>this.getSpecificModule(moduleIndex)).controls['moduleName'].setValue(module.moduleName);

      // Loop through all privilleges of module
      for (let i = 0; i < module.privilleges.length; ++i) {
        // If i!=0 then add privillege because if it is 0 then privillege is already created
        if (i != 0) {
          this.addPrivillege(moduleIndex);
        }

        // Update the value of pattern and privillege
        this.patterns[moduleIndex][i] = module.privilleges[i].pattern;
        this.updateModulePrivilleges(moduleIndex, i);
        this.updateModuleChildPrivillege(moduleIndex, i, module.privilleges[i].privilleges)

      }
    });
  }

  // This function is responisble for updating the module's any child privillege
  updateModuleChildPrivillege(moduleIndex, privillegesIndex, privillege) {
    // Get modules
    const allModules = (<FormArray>this.roleForm.get('modules'));

    // Get that module privilleges
    const modulePrivilleges = (<FormArray>allModules.at(moduleIndex).get('privilleges'));

    // Update specific privillege's privillege
    (<FormGroup>modulePrivilleges.controls[privillegesIndex]).controls['privilleges'].setValue(privillege);
  }

  // This function is responsible for adding the privillege form group
  addPrivillegesFormGroup(moduleIndex): FormGroup {
    this.patterns[moduleIndex].push([]);
    return this.fb.group({
      pattern: [[], [Validators.required, Validators.pattern("[A-Za-z0-9_].*[*.]")]],
      privilleges: ['']
    })
  }

  // This function is responsible for adding the module form group
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

  // This function is responsible for adding the privillege in module
  addPrivillege(moduleIndex) {
    const modulePrivilleges = (<FormArray>this.roleForm.get('modules')).controls[moduleIndex].get('privilleges');
    (<FormArray>modulePrivilleges).push(this.addPrivillegesFormGroup(moduleIndex));
  }

  // This function is responsible for deleteing the privillege
  deleteModule(moduleIndex) {
    // Remove module
    this.modules.removeAt(moduleIndex);
    this.patterns.splice(moduleIndex, 1);
  }

  // This function is responsible for deleteing the privillege
  deletePrivillege(moduleIndex, privillegesIndex) {
    // Get privilleges array
    const modulePrivilleges = this.getSpecificModule(moduleIndex).get('privilleges');

    // if privilleges length is 1 then show alert message and return
    if ((<FormArray>modulePrivilleges).length == 1) {
      alert("There must be at least one privillege");
      return;
    }

    // Remove Module privillege
    (<FormArray>modulePrivilleges).removeAt(privillegesIndex);
    this.patterns[moduleIndex].splice(privillegesIndex, 1);
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

  getSpecificPrivillege(moduleIndex, privillegesIndex) {
    return (<FormArray>this.getSpecificModule(moduleIndex).get("privilleges")).controls[privillegesIndex];
  }

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

    const regex = /[A-Za-z0-9_].*[*.]/g;
    if (!regex.test(value)) {
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
  checkModuleExistInThisRole({ modules }) {
    // Iterate through all modules
    for (let module of modules) {
      // Check how many got matched
      const match = modules.filter(m => m.moduleName == module.moduleName);
      //If more then one match then alert and return true
      if (match.length > 1) {
        alert(`${module.moduleName} module has been used more then once...`)
        return true;
      }
    }
    return false;
  }

  // This function is responsible for updating the role
  async updateRole(data) {
    // Checking that module in current role already exist or not
    if (this.checkModuleExistInThisRole(data)) {
      return;
    }


    //ckecking if Module Already Exist
    let flag = false;
    for (const module of data.modules) {
      const response = await this.rolesService.checkModule(module.moduleName).toPromise();
      if (response.hits.hits.length == 1 && response.hits.hits[0]._id != this.roleId) {
        flag = true;
        alert(`Module ${module.moduleName} Already Exist In Other Role!!`);
      }
    }
    if (!flag) {
      this.rolesService.updateRole(data, this.roleId)
        .subscribe(data => {
          setTimeout(() => {
            this.router.navigateByUrl("/roles");
          }, 800);
        },
        err => this.router.navigate(['/oops']));
    }
  }


  // This function is responsible go to roles list on cancle click in form
  cancelClick() {
    this.router.navigate(['/roles']);
  }

}
