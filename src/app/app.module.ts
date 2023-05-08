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
import { IdTransformPipe } from 'src/app/Utils/IdTransformPipe'
import { HttpClientModule } from '@angular/common/http';
import { MarkdownPipe } from './Utils/markdown.pipe';
import { AutocompletionPipe } from './Utils/autocompletion.pipe';
import { SafeHtmlPipe } from './Utils/safe-html.pipe';
import { LinkPageComponent } from './encyclopedie/detail-fiche/link-page/link-page.component';
import { PageBlocComponent } from './encyclopedie/detail-fiche/page-bloc/page-bloc.component';
import { JustTextPipe } from './Utils/just-text.pipe';
import { AutocompleteInputComponent } from './Utils/autoComplete/autocomplete-input/autocomplete-input.component';
import { AutocompleteReaderComponent } from './Utils/autoComplete/autocomplete-reader/autocomplete-reader.component';

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
    IdTransformPipe,
    MarkdownPipe,
    AutocompletionPipe,
    SafeHtmlPipe,
    LinkPageComponent,
    PageBlocComponent,
    JustTextPipe,
    AutocompleteInputComponent,
    AutocompleteReaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [ MarkdownPipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
