import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { EncyclopedieComponent } from './encyclopedie/encyclopedie.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ArboPageComponent } from './encyclopedie/arbo-page/arbo-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EncyclopedieComponent,
    AccueilComponent,
    ArboPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
