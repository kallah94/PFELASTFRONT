import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./pages/index/index.component";
import { ProfilepageComponent } from "./pages/examples/profilepage/profilepage.component";
import { RegisterpageComponent } from "./pages/examples/registerpage/registerpage.component";
import { LandingpageComponent } from "./pages/examples/landingpage/landingpage.component";
import { HomeComponent } from "./pages/vues/home/home.component";
import { ProviderComponent } from "./pages/vues/provider/provider.component";
import { ProjectComponent } from "./pages/vues/project/project.component";
import { ReglesComponent } from "./pages/vues/regles/regles.component";
import { PriceComponent } from './pages/vues/price/price.component';

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: IndexComponent },
  {path: "management", component: HomeComponent},
  { path: "profile", component: ProfilepageComponent },
  { path: "register", component: RegisterpageComponent },
  { path: "landing", component: LandingpageComponent },
  {path: 'providers', component: ProviderComponent},
  {path: 'projects', component: ProjectComponent},
  {path: 'regles', component: ReglesComponent},
  {path: 'price', component: PriceComponent}

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
export class AppRoutingModule {}
