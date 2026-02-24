import { Component, inject, OnDestroy, signal } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { AuthService } from "../../services/auth.service";
import { SessionService } from "../../services/session.service";
import { Session } from "../../models/app.model";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnDestroy {
  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  currentUser = this.authService.getCurrentUser();
  isAdmin = this.authService.isAdmin();

  sessions = signal<Session[]>([]);
  closedSessions = signal<Session[]>([]);

  newSessionName = signal("");
  activeTab = signal<"active" | "history">("active");

  creatingSession = signal(false);
  closingSessionId = signal<number | null>(null);

  error = signal("");

  constructor() {
    this.loadSessions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSessions() {
    this.sessionService
      .getSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (s) => this.sessions.set(s),
        error: (_e) => this.error.set("Failed to load sessions"),
      });
  }

  loadClosedSessions() {
    if (this.closedSessions().length) return;
    this.sessionService
      .getClosedSessions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (s) => this.closedSessions.set(s),
        error: (_e) => this.error.set("Failed to load closed sessions"),
      });
  }

  createSession() {
    const name = this.newSessionName().trim();
    if (!name) return;

    this.creatingSession.set(true);
    this.error.set("");

    this.sessionService
      .createSession(name, this.currentUser.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.creatingSession.set(false);
          this.newSessionName.set("");
          this.loadSessions();
        },
        error: () => {
          this.creatingSession.set(false);
          this.error.set("Failed to create session");
        },
      });
  }

  joinSession(sessionId: number) {
    this.router.navigate(["/session", sessionId]);
  }

  viewLeaderboard(sessionId: number) {
    this.router.navigate(["/leaderboard", sessionId]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(["/login"]);
  }

  getParticipantCount(session: Session) {
    return session?.participantCount ?? 0;
  }

  switchTab(tab: "active" | "history") {
    this.error.set("");
    this.activeTab.set(tab);
    if (tab === "history") this.loadClosedSessions();
  }

  closeSession(sessionId: number) {
    if (!confirm("Are you sure you want to close this session?")) return;

    this.closingSessionId.set(sessionId);

    this.sessionService
      .closeSession(sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closingSessionId.set(null);
          this.loadSessions();
        },
        error: () => {
          this.closingSessionId.set(null);
          this.error.set("Failed to close session");
        },
      });
  }
}
