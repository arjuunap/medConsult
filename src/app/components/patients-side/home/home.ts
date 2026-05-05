import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  patient = {
    initials: 'AH',
    name: 'Ahmed Hassan',
    id: 'ID 00421',
    nextAppt: 'Today 10:30',
    alert: 'HbA1c high',
    stats: [
      { label: 'Blood Pressure', value: '142/90', unit: '',     status: 'danger' },
      { label: 'Heart Rate',     value: '98',     unit: 'bpm',  status: 'warning' },
      { label: 'Blood Sugar',    value: '8.2',    unit: 'mmol', status: 'danger' },
      { label: 'Weight',         value: '84',     unit: 'kg',   status: 'normal' }
    ]
  };
}