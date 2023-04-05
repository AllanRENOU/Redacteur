import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { EncyclopedieComponent } from './encyclopedie/encyclopedie.component';
import { AccueilComponent } from './accueil/accueil.component';

const routes: Routes = [
  { path : "", component : AccueilComponent },
  { path: "encyclopedie", title:"Encyclopédie", component : EncyclopedieComponent },
  { path: "encyclopedie/:id", title:"Encyclopédie", component : EncyclopedieComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
