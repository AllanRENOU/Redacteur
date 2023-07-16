import { NgModule, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncyclopedieComponent } from './encyclopedie/encyclopedie.component';
import { AccueilComponent } from './accueil/accueil.component';
import { AxesComponent } from './axes/axes.component';
import { StructureComponent } from './structure/structure.component';

export const URL_PARAM_ID_PROJET = "idProj";
export const URL_PARAM_ID_FICHE = "idFiche";

const routes: Routes = [
  { path : "", component : AccueilComponent },
  { path: ":" + URL_PARAM_ID_PROJET + "/encyclopedie", title:"Encyclopédie", component : EncyclopedieComponent },
  { path: ":" + URL_PARAM_ID_PROJET + "/encyclopedie/:" + URL_PARAM_ID_FICHE, title:"Encyclopédie", component : EncyclopedieComponent },
  { path: ":" + URL_PARAM_ID_PROJET + "/axes", title:"Axes", component : AxesComponent },
  { path: ":" + URL_PARAM_ID_PROJET + "/structure", title:"Structure", component : StructureComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
