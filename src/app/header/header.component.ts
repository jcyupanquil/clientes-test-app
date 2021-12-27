import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    title: String = 'App Angular Spring';

    constructor(private authService: AuthService,
        private router: Router) { }

    ngOnInit() {
    }

    logout(): void {
        this.authService.logout();
        Swal.fire('Success', 'Logged out successfully', 'success');
        this.router.navigate(['/clientes']);
    }
}