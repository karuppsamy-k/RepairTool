import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobileRepairApiService, RepairJob } from '../services/mobile-repair-api.service';

@Component({
  selector: 'app-customer-device-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-device-screen.component.html',
  styleUrls: ['./customer-device-screen.component.css'],
})
export class CustomerDeviceScreenComponent {
  private api = inject(MobileRepairApiService);

  repairs: RepairJob[] = [];
  selected: RepairJob | null = null;

  form: Partial<RepairJob> = {
    status: 'pending',
  };

  loading = false;
  error: string | null = null;

  async ngOnInit() {
    await this.loadRepairs();
  }

  async loadRepairs() {
    this.loading = true;
    this.error = null;
    try {
      this.repairs = await this.api.getAllRepairs();
    } catch (e: any) {
      this.error = e?.message || 'Failed to load repair jobs';
    } finally {
      this.loading = false;
    }
  }

  startAdd() {
    this.selected = null;
    this.form = {
      customerName: '',
      phoneModel: '',
      issue: '',
      status: 'pending',
      priceEstimate: 0,
    };
  }

  startEdit(job: RepairJob) {
    this.selected = job;
    this.form = { ...job };
  }

  cancel() {
    this.selected = null;
    this.form = { status: 'pending' };
    this.error = null;
  }

  async save() {
    this.error = null;

    if (!this.form.customerName || !this.form.phoneModel || !this.form.issue) {
      this.error = 'Customer name, phone model, and issue are required.';
      return;
    }

    try {
      if (this.selected) {
        const updated = await this.api.updateRepair(this.selected.id, {
          customerName: this.form.customerName!,
          phoneModel: this.form.phoneModel!,
          issue: this.form.issue!,
          status: (this.form.status as RepairJob['status']) || 'pending',
          priceEstimate: this.form.priceEstimate ?? 0,
        });
        this.repairs = this.repairs.map(r => r.id === updated.id ? updated : r);
      } else {
        const created = await this.api.createRepair({
          customerName: this.form.customerName!,
          phoneModel: this.form.phoneModel!,
          issue: this.form.issue!,
          status: (this.form.status as RepairJob['status']) || 'pending',
          priceEstimate: this.form.priceEstimate ?? 0,
        });
        this.repairs = [created, ...this.repairs];
      }

      this.cancel();
    } catch (e: any) {
      this.error = e?.message || 'Failed to save repair job';
    }
  }

  async remove(id: number) {
    if (!confirm('Delete this repair job?')) {
      return;
    }
    this.error = null;
    try {
      await this.api.deleteRepair(id);
      this.repairs = this.repairs.filter(r => r.id !== id);
      if (this.selected?.id === id) {
        this.cancel();
      }
    } catch (e: any) {
      this.error = e?.message || 'Failed to delete repair job';
    }
  }
}
