import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = 'http://localhost:3000/api/sessions';

  constructor(private http: HttpClient) { }

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getSessionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSession(nom: string, createur: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { nom, createur });
  }

  joinSession(sessionId: number, utilisateur: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${sessionId}/join`, { utilisateur });
  }

  updateResponses(sessionId: number, utilisateur: string, reponses: (number | null)[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${sessionId}/responses`, {
      utilisateur,
      reponses,
    });
  }

  getLeaderboard(sessionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${sessionId}/leaderboard`);
  }

  closeSession(sessionId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${sessionId}/close`, {});
  }

  getClosedSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/closed/list`);
  }
}

