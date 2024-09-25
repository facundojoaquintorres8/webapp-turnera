import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgendaService } from './agenda.service';
import { IResponse } from '../models/response.models';
import { IAgenda } from '../models/agenda.models';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ObservationModalComponent } from '../component/observation-modal/observation-modal.component';

@Component({
  selector: 'app-detail-agenda',
  templateUrl: './detail-agenda.component.html'
})
export class DetailAgendaComponent implements OnInit {
  agenda!: IAgenda;
  private ngbModalRef: NgbModalRef | undefined;

  constructor(
    private agendaService: AgendaService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id) {
      this.agendaService.find(parseInt(id)).subscribe(
        (res: HttpResponse<IResponse>) =>  this.agenda = res.body?.data
      );
    }
  }

  seeObservations(observations: string): void {
    this.ngbModalRef = this.modalService.open(ObservationModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.observations = observations;
    this.ngbModalRef.result.then(
      () => {
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }

  previousState(): void {
    window.history.back();
  }
}
