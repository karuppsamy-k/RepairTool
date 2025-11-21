import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MobileRepairApiService {
  private apiUrl = '/api/mobile-repair'; // Adjust to your Kotlin backend URL

  private lastStatusSignal = signal<string>('Idle');

  constructor(private http: HttpClient) {}

  // Original demo trigger method the placeholder UI calls
  triggerRepairTool() {
    this.lastStatusSignal.set('Calling Mobile Repair Tool API...');
    this.http.get(`${this.apiUrl}/status`, { responseType: 'text' }).subscribe({
      next: (response) => {
        this.lastStatusSignal.set(`API Response: ${response}`);
      },
      error: (error) => {
        console.error(error);
        this.lastStatusSignal.set('Error calling Mobile Repair Tool API');
      },
    });
  }

  lastStatus() {
    return this.lastStatusSignal();
  }
}
