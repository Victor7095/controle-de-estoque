import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/demo/service/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    providers: [MessageService],
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    valCheck: string[] = ['remember'];
    form: FormGroup;

    constructor(
        private fb: FormBuilder,
        public layoutService: LayoutService,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.form = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });
    }

    login() {
        const val = this.form.value;

        console.log('Form submitted!');
        this.authService
            .login(val.username, val.password)
            .then(() => {
                this.router.navigateByUrl('/');
            })
            .catch((err) => {
                console.log(err.error.detail);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err ? err.error ? err.error.detail : "Erro ao fazer login" : "Erro ao fazer login",
                    life: 3000,
                });
            });
    }
}
