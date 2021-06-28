import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { HomeComponent } from "./pages/vues/home/home.component";
import { ProviderComponent } from "./pages/vues/provider/provider.component";
import { ProjectComponent } from "./pages/vues/project/project.component";
import { ReglesComponent } from "./pages/vues/regles/regles.component";
import { PriceComponent } from "./pages/vues/price/price.component";
import { ConditionComponent } from "./pages/vues/condition/condition.component";
import { AuthGuard } from "./service/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  { path: "index", component: IndexComponent },
  {
    path: "management", component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'providers', component: ProviderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'projects', component: ProjectComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'regles', component: ReglesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'pricing', component: PriceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'conditions', component: ConditionComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: []
})
export class AppRoutingModule { }
