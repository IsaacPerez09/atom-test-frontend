import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from './api.models';
import { environment } from '../../../environments/environment';

export interface HttpResult<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
  meta?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  async get<T>(url: string, params?: Record<string, string>): Promise<HttpResult<T>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    try {
      const response = await firstValueFrom(
        this.http.get<ApiResponse<T>>(`${this.baseUrl}${url}`, { params: httpParams })
      );
      return {
        success: response.success,
        data: response.data,
        error: response.error,
        meta: response.meta
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async post<T>(url: string, body: unknown): Promise<HttpResult<T>> {
    try {
      const response = await firstValueFrom(
        this.http.post<ApiResponse<T>>(`${this.baseUrl}${url}`, body)
      );
      return {
        success: response.success,
        data: response.data,
        error: response.error,
        meta: response.meta
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async patch<T>(url: string, body: unknown): Promise<HttpResult<T>> {
    try {
      const response = await firstValueFrom(
        this.http.patch<ApiResponse<T>>(`${this.baseUrl}${url}`, body)
      );
      return {
        success: response.success,
        data: response.data,
        error: response.error,
        meta: response.meta
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  async delete<T>(url: string): Promise<HttpResult<T>> {
    try {
      const response = await firstValueFrom(
        this.http.delete<ApiResponse<T>>(`${this.baseUrl}${url}`)
      );
      return {
        success: response.success,
        data: response.data,
        error: response.error,
        meta: response.meta
      };
    } catch (err) {
      return this.handleError(err);
    }
  }

  private handleError(err: unknown): HttpResult<any> {
    if (err instanceof HttpErrorResponse) {

      if (err.status === 0) {
        return {
          success: false,
          data: null,
          error: {
            code: 'CONNECTION_REFUSED',
            message: 'No se pudo conectar con el servidor.'
          }
        };
      }


      const errorBody = err.error;
      return {
        success: errorBody?.success ?? false,
        data: null,
        error: errorBody?.error ?? { code: `HTTP_${err.status}`, message: err.message }
      };
    }


    return {
      success: false,
      data: null,
      error: { code: 'CLIENT_ERROR', message: (err as Error).message || 'Ocurrió un error inesperado' }
    };
  }
}