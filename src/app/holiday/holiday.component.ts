import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../component/table/table.component';
import { IHeader } from '../component/table/table.models';
import { IHoliday } from '../models/holiday.models';
import { DeleteHolidayModalComponent } from './delete-holiday-modal.component';
import { HolidayService } from './holiday.service';
import { IInput, InputTypeEnum } from '../component/filter/filter.models';
import { getListToBoolean } from '../shared/generic-util';
import { formatDateFromNgbDateStruct } from '../shared/date-util';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html'
})
export class HolidayComponent implements OnInit {
  @ViewChild('tableComponent') tableComponent!: TableComponent;
  private ngbModalRef: NgbModalRef | undefined;

  headers!: IHeader[];
  sort: string[] = ['ASC', 'date'];

  filterInputs!: IInput[];

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
    this.filterInputs = [
      { label: 'Fecha', type: InputTypeEnum.DATE, name: 'date', width: 2 },
      { label: 'Descripción', type: InputTypeEnum.TEXT, name: 'description', width: 4 },
      { label: 'Usar en Agenda', type: InputTypeEnum.LIST, name: 'useInAgenda', width: 2, itemList: getListToBoolean() },
      { label: 'Activos', type: InputTypeEnum.LIST, name: 'active', width: 2, itemList: getListToBoolean() },
    ];

    this.headers = [
      { label: 'Fecha', colName: 'date', canSort: true },
      { label: 'Descripción', colName: 'description', canSort: true },
      { label: 'Usar en Agenda', colName: 'useInAgenda', canSort: true },
      { label: 'Activo', colName: 'active', canSort: true }
    ];
  }

  query = (req?: any) => this.holidayService.findAllByFilter({ ...req, ...this.createFromForm()});


  getItems(): void {
    this.tableComponent.executeQuery({ page: 1 });
  }

  clear(): void {
    this.myForm.get('date')?.setValue(null, { emitEvent: false, emitViewToModelChange: false });
    this.myForm.get('description')?.setValue(null);
    this.myForm.get('useInAgenda')?.setValue(null);
    this.myForm.get('active')?.setValue(null);

    this.tableComponent.executeQuery({ page: 1 });
  }

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

  private createFromForm(): any {
    return {
      date: formatDateFromNgbDateStruct(this.myForm.get(['date'])!.value),
      description: this.myForm.get(['description'])!.value,
      useInAgenda: this.myForm.get(['useInAgenda'])!.value,
      active: this.myForm.get(['active'])!.value,
    };
  }
}
