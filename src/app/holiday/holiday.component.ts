import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader, InputTypeEnum } from '../component/table/table.models';
import { IHoliday } from '../models/holiday.models';
import { DeleteHolidayModalComponent } from './delete-holiday-modal.component';
import { HolidayService } from './holiday.service';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html'
})
export class HolidayComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'date'];
  myForm = this.fb.group({
    date: [null],
    description: [null],
    useInAgenda: [null],
    active: [null],
  });
  constructor(
    private holidayService: HolidayService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.headers = [
      { label: 'Fecha', inputType: InputTypeEnum.DATE, inputName: 'date', sort: true },
      { label: 'Descripción', inputType: InputTypeEnum.TEXT, inputName: 'description', sort: true },
      { label: 'Usar en Agenda', inputType: InputTypeEnum.BOOLEAN, inputName: 'useInAgenda', sort: true },
      { label: 'Activo', inputType: InputTypeEnum.BOOLEAN, inputName: 'active', sort: false }
    ];
  }

  query = (req?: any) => this.holidayService.findAllByFilter(req);

  delete(holiday: IHoliday): void {
    this.ngbModalRef = this.modalService.open(DeleteHolidayModalComponent, { size: 'lg', backdrop: 'static' });
    this.ngbModalRef.componentInstance.holiday = holiday;
    this.ngbModalRef.result.then(
      () => {
        this.tableComponent.executeQuery({ page: 1 });
        this.ngbModalRef = undefined;
      },
      () => {
        this.ngbModalRef = undefined;
      }
    );
  }
}
