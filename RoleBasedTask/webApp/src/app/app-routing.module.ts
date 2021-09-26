import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './Admin/UserComponents/user-list/user-list.component';
import { AddEditUserComponent } from './Admin/UserComponents/add-edit-user/add-edit-user.component';
import { RoleListComponent } from './Admin/RoleComponents/role-list/role-list.component';
import { CreateRoleFormComponent } from './Admin/RoleComponents/create-role-form/create-role-form.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './User/home/home.component';
import { NameListComponent } from './User/name-list/name-list.component';
import { AdminGuard } from './Admin/admin.guard';
import { UserGuard } from './User/user.guard';
import { LoginGuard } from './login/login.guard';
import { EditRoleFormComponent } from './Admin/RoleComponents/edit-role-form/edit-role-form.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { InternalServerErrorComponent } from './internal-server-error/internal-server-error.component';

const routes: Routes = [
  {path:'',redirectTo:'/login',pathMatch:'full',canActivate: [LoginGuard]},
  {path:'login',component:LoginComponent,canActivate: [LoginGuard]},
  //{path:'users/:id',component:AddEditUserComponent,canActivate: [AdminGuard]},
  { 
    path:'users',
    data: {
      breadcrumb: 'Users',
    },
    children: [
      {
        path:'',
        component:UserListComponent,
        canActivate: [AdminGuard],
      },
      { 
        path:'addUser',
        component:AddEditUserComponent,
        canActivate: [AdminGuard],
        data: {
          breadcrumb: 'Add User',
        },
      },
      {
        path:':id',
        component:AddEditUserComponent,
        canActivate: [AdminGuard],
        data: {
          breadcrumb: 'Edit User',
        },
      }
    ],
  },
  //{path:'users/addUser',component:AddEditUserComponent,canActivate: [AdminGuard]},
  // {path:'roles/:id',component:EditRoleFormComponent},
  { 
    path:'roles',
    data: {
      breadcrumb: 'Roles',
    },
    children: [
      {
        path:'',
        component:RoleListComponent,
        canActivate: [AdminGuard],
      },
      { 
        path:'addRole',
        component:CreateRoleFormComponent,
        canActivate: [AdminGuard],
        data: {
          breadcrumb: 'Add Role',
        },
      },
      {
        path:':id',
        component:EditRoleFormComponent,
        canActivate: [AdminGuard],
        data: {
          breadcrumb: 'Edit Role',
        },
      }
    ],
  },
  // {path:'roles/addRole',component:CreateRoleFormComponent,canActivate: [AdminGuard]},
  {path:'user-home',component:HomeComponent,canActivate: [UserGuard]},
  {path:'module/:name',component:NameListComponent,canActivate: [UserGuard]},
  {path: '404', component: PageNotFoundComponent},
  {path: 'oops', component: InternalServerErrorComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
