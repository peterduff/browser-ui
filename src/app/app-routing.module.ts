import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from "./app.component";

const routes: Routes = [
    {
        path: ':codesystem',
        component: AppComponent,
        children: [
            {
                path: ':version',
                component: AppComponent,
                children: [
                    {
                        path: ':concept',
                        component: AppComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
