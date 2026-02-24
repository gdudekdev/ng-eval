import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { AuthService } from "../../services/auth.service";
import { SessionService } from "../../services/session.service";
import { ProductService } from "../../services/product.service";
import { Product, Session } from "../../models/app.model";

@Component({
  selector: "app-session",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./session.component.html",
  styleUrls: ["./session.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionComponent implements OnInit, OnDestroy {
  // services
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroy$ = new Subject<void>();

  // user
  currentUser = this.authService.getCurrentUser();

  // state (signals)
  session = signal<Session | null>(null);
  products = signal<Map<number, Product>>(new Map());

  sessionId = signal<number>(0);
  currentQuestion = signal<number>(0);

  responses = signal<(number | null)[]>([]);
  scores = signal<number[]>([]);

  loading = signal(false);
  error = signal("");
  showResult = signal(false);
  sessionFinished = signal(false);

  Math = Math;

  // derived state
  progress = computed(() => {
    const s = this.session();
    if (!s) return 0;
    return Math.round(((this.currentQuestion() + 1) / s.produits.length) * 100);
  });

  currentProduct = computed(() => {
    const s = this.session();
    const q = this.currentQuestion();
    if (!s) return undefined;
    return this.products().get(s.produits[q]);
  });

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(["/login"]);
      return;
    }

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.sessionId.set(Number(params["id"]));
      this.loadSession();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadSession(): void {
    this.loading.set(true);

    this.sessionService
      .getSessionById(this.sessionId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (session) => {
          this.session.set(session);
          this.loadProducts();

          const userExists = session.participants?.some(
            (p: any) => p.utilisateur === this.currentUser.email,
          );

          if (!userExists) {
            this.joinSession();
            return;
          }

          this.initializeResponses();
          this.loading.set(false);
        },
        error: () => {
          this.error.set("Failed to load session");
          this.loading.set(false);
        },
      });
  }

  joinSession(): void {
    this.sessionService
      .joinSession(this.sessionId(), this.currentUser.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.loadSession(),
        error: () => {
          this.error.set("Failed to join session");
          this.loading.set(false);
        },
      });
  }

  loadProducts(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          const map = new Map<number, Product>();
          products.forEach((p) => map.set(p.id, p));

          this.products.set(map);
        },
        error: (err) => console.error("Error loading products:", err),
      });
  }

  initializeResponses(): void {
    const s = this.session();
    if (!s) return;

    this.responses.set(Array(s.produits.length).fill(null));
    this.scores.set(Array(s.produits.length).fill(0));
  }

  updateResponse(value: number) {
    const arr = [...this.responses()];
    arr[this.currentQuestion()] = value;
    this.responses.set(arr);
  }

  submitAnswer(estimatedPrice: number): void {
    if (
      estimatedPrice === null ||
      estimatedPrice === undefined ||
      estimatedPrice < 0
    ) {
      this.error.set("Please enter a valid price");
      return;
    }

    const q = this.currentQuestion();

    const newResponses = [...this.responses()];
    newResponses[q] = estimatedPrice;
    this.responses.set(newResponses);

    const product = this.currentProduct();

    if (product) {
      const score = Math.max(0, 100 - Math.abs(estimatedPrice - product.prix));

      const newScores = [...this.scores()];
      newScores[q] = Math.round(score * 100) / 100;
      this.scores.set(newScores);
    }

    this.showResult.set(true);
    this.error.set("");
  }

  nextQuestion(): void {
    const s = this.session();
    if (!s) return;

    if (this.currentQuestion() < s.produits.length - 1) {
      this.currentQuestion.update((v) => v + 1);
      this.showResult.set(false);
    } else {
      this.finishSession();
    }
  }

  finishSession(): void {
    this.loading.set(true);

    this.sessionService
      .updateResponses(
        this.sessionId(),
        this.currentUser.email,
        this.responses(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.sessionFinished.set(true);
        },
        error: () => {
          this.error.set("Failed to save responses");
          this.loading.set(false);
        },
      });
  }

  viewLeaderboard(): void {
    this.router.navigate(["/leaderboard", this.sessionId()]);
  }

  backToDashboard(): void {
    this.router.navigate(["/dashboard"]);
  }
}
