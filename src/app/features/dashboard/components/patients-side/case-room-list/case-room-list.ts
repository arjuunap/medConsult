import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cases } from '../../../../../core/services/caseServices/case';
import { Router } from '@angular/router';
export interface Case {
  code: string;
  name: string;
  department: string;
  status: 'OPEN';
  severity: 'CRITICAL' | 'URGENT' | null;
  members: number;
}

@Component({
  selector: 'app-case-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './case-room-list.html',
  styleUrl: './case-room-list.css'
})
export class CaseSidebarComponent {
  constructor(
    private caseService: Cases,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  cases: any[] = []

  

  ngOnInit(): void {
    this.caseService.getCaseList().subscribe({
      next: (res: any) => {
        this.cases = res;
        this.cd.detectChanges();
        console.log("cases", this.cases);
      }
    })
  }
    goToCaseDiscussion(caseId: string) {
    this.router.navigate(['/layout/case-discussion', caseId]);
  }
  


  

  
}