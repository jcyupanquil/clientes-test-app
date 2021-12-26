import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: String = 'Esto es Udemy';

  curso: String = 'Este es el curso de Spring - Angular';
  profesor: String = 'Profesor de la clase';
}
