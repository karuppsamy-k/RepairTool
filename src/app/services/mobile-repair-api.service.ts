import { Injectable } from '@angular/core';

export interface RepairJob {
  id: number;
  customerName: string;
  phoneModel: string;
  issue: string;
  status: 'pending' | 'in_progress' | 'completed' | 'delivered';
  priceEstimate: number;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class MobileRepairApiService {
  private readonly baseUrl = 'http://127.0.0.1:8080/repairs';

  async getAllRepairs(): Promise<RepairJob[]> {
    const res = await fetch(this.baseUrl, { method: 'GET' });
    if (!res.ok) {
      throw new Error('Failed to load repairs');
    }
    return res.json();
  }

  async createRepair(job: Omit<RepairJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<RepairJob> {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!res.ok) {
      throw new Error('Failed to create repair');
    }
    return res.json();
  }

  async updateRepair(id: number, job: Partial<RepairJob>): Promise<RepairJob> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!res.ok) {
      throw new Error('Failed to update repair');
    }
    return res.json();
  }

  async deleteRepair(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete repair');
    }
  }
}
