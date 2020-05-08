import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfmakeModule } from './pdfmake/pdfmake.module';
import { ExampleComponent } from './example/example.component';


@NgModule({
  declarations: [
    ExampleComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PdfmakeModule,
  ],
  providers: [],
  bootstrap: [ExampleComponent]
})
export class AppModule { }