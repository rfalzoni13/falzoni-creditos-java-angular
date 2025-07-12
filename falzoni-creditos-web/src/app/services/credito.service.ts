import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { Credito } from '../models/credito.model';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCreditByNfse(numeroNfse: string): Observable<Credito[]> {
    return this.http.get<Credito[]>(`${this.url}/creditos/${numeroNfse}`).pipe(
      map(response => response || []),
      catchError((err: any) => {
        return throwError(() => new Error("Erro ao efetivar a busca"))
      })
    );
  }

  getCreditoByNumber(numeroCredito: string): Observable<Credito> {
    return this.http.get<Credito>(`${this.url}/creditos/credito/${numeroCredito}`).pipe(
      map(response => response),
      catchError((err: any) => {
        if(err.status === 404) {
          return throwError(() => new Error("Crédito não encontrado"));
        }
        return throwError(() => new Error("Ocorreu um erro ao tentar realizar a consulta. Por favor, tente novamente mais tarde."))
      })
    );
  }
}
