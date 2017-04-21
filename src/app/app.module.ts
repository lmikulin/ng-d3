import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {ResourceGridComponent} from './components/resource-grid/resource-grid.component';
import {CssGridComponent} from './components/css-grid/css-grid.component';

const appRoutes: Routes = [
    {path: 'svg/:tasks/:resources', component: ResourceGridComponent},
    {path: 'grid', component: CssGridComponent}
];

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
        RouterModule.forRoot(appRoutes)
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
