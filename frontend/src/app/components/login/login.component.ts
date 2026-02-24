import { Component, inject, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  email = signal("");
  password = signal("");

  error = signal("");
  loading = signal(false);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    if (!this.email() || !this.password()) {
      this.error.set("Email and password are required");
      return;
    }

    this.loading.set(true);
    this.error.set("");

    this.authService
      .login(this.email(), this.password())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(["/dashboard"]);
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err?.error?.error ?? "Login failed. Please try again.",
          );
        },
      });
  }

  useDemoUser(email: string, password: string): void {
    this.email.set(email);
    this.password.set(password);
    this.onLogin();
  }
}
