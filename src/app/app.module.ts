import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ResourceGridComponent } from './components/resource-grid/resource-grid.component';
import { CssGridComponent } from './components/css-grid/css-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    ResourceGridComponent,
    CssGridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {path: 'svg', component: ResourceGridComponent},
      {path: 'grid', component: CssGridComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
