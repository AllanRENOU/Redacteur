import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { EncyclopedieComponent } from './encyclopedie/encyclopedie.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ArboPageComponent } from './encyclopedie/arbo-page/arbo-page.component';
import { DetailFicheComponent } from './encyclopedie/detail-fiche/detail-fiche.component';
import { FloatMenuComponent } from './Utils/float-menu/float-menu.component';
import { CreateFicheComponent } from './encyclopedie/create-fiche/create-fiche.component';
import { IdTransformPipe } from 'src/app/Utils/IdTransformpipe'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EncyclopedieComponent,
    AccueilComponent,
    ArboPageComponent,
    DetailFicheComponent,
    FloatMenuComponent,
    CreateFicheComponent,
    IdTransformPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
