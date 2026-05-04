import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
      if (err instanceof HttpErrorResponse && err.error) {
        return {
          success: err.error.success ?? false,
          data: null,
          error: err.error.error ?? { code: 'UNKNOWN', message: err.message }
        };
      }
      throw err;
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
      if (err instanceof HttpErrorResponse && err.error) {
        return {
          success: err.error.success ?? false,
          data: null,
          error: err.error.error ?? { code: 'UNKNOWN', message: err.message }
        };
      }
      throw err;
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
      if (err instanceof HttpErrorResponse && err.error) {
        return {
          success: err.error.success ?? false,
          data: null,
          error: err.error.error ?? { code: 'UNKNOWN', message: err.message }
        };
      }
      throw err;
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
      if (err instanceof HttpErrorResponse && err.error) {
        return {
          success: err.error.success ?? false,
          data: null,
          error: err.error.error ?? { code: 'UNKNOWN', message: err.message }
        };
      }
      throw err;
    }
  }
}