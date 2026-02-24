import { Component, inject, OnDestroy, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { SessionService } from "../../services/session.service";
import { ProductService } from "../../services/product.service";
import { LeaderboardEntry, Session } from "../../models/app.model";

@Component({
  selector: "app-leaderboard",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./leaderboard.component.html",
  styleUrls: ["./leaderboard.component.css"],
})
export class LeaderboardComponent implements OnDestroy {
  private sessionService = inject(SessionService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  sessionId = signal<number>(0);

  session = signal<Session | null>(null);
  leaderboard = signal<LeaderboardEntry[]>([]);

  loading = signal(false);
  error = signal("");

  selectedEntry = signal<LeaderboardEntry | null>(null);

  Math = Math;

  medal = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "•";
    }
  };

  scoreColor = (score: number) => {
    if (score >= 75) return "#4caf50";
    if (score >= 50) return "#ff9800";
    return "#f44336";
  };

  constructor() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.sessionId.set(Number(params["id"]));
      this.loadData();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading.set(true);

    this.sessionService
      .getSessionById(this.sessionId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (session) => {
          this.session.set(session);
          this.loadLeaderboard();
        },
        error: () => {
          this.error.set("Failed to load session");
          this.loading.set(false);
        },
      });
  }

  loadLeaderboard(): void {
    this.sessionService
      .getLeaderboard(this.sessionId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leaderboard) => {
          this.leaderboard.set(leaderboard);
          this.loading.set(false);
        },
        error: () => {
          this.error.set("Failed to load leaderboard");
          this.loading.set(false);
        },
      });
  }

  toggleDetails(entry: LeaderboardEntry): void {
    if (this.selectedEntry() === entry) {
      this.selectedEntry.set(null);
      return;
    }

    this.selectedEntry.set(entry);
  }

  backToDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }
}
