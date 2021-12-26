import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeES from '@angular/common/locales/es-PE';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ClienteService } from './clientes/cliente.service';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';




registerLocaleData(localeES);

const routes: Routes = [
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
  { path: 'directivas', component: DirectivaComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/page/:pageNumber', component: ClientesComponent },
  { path: 'clientes/form', component: FormComponent },
  { path: 'clientes/form/:id', component: FormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [ClienteService, { provide: LOCALE_ID, useValue: 'es-PE' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
