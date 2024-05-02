import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMembers } from '../members.model';

@Component({
  selector: 'jhi-members-detail',
  templateUrl: './members-detail.component.html',
})
export class MembersDetailComponent implements OnInit {
  members: IMembers | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ members }) => {
      this.members = members;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
