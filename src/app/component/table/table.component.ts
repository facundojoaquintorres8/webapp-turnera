import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IHeader, InputTypeEnum } from './table.models';
import { IResponse } from 'src/app/models/response.models';
import { IInput } from '../filter/filter.models';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    @Input() queryItems!: (req?: any) => Observable<HttpResponse<IResponse>>;
    @Input() headers: IHeader[] = [];
    @Input() filterInputs: IInput[] = [];
    @Input() myForm!: FormGroup;
    @Input() sort!: string[];
    @Input() hasButtons: boolean = false;
    @Input() page: number = 1;
    @Input() bodyTemplate!: TemplateRef<any>;

    totalPages: number = 0;
    items: any[] = [];
    inputType: any = InputTypeEnum;

    constructor() {}

    ngOnInit(): void {
        this.executeQuery({ page: 1 });
    }

    executeQuery($event: any): void {
        this.page = $event.page || 1;
        if ($event.sort) {
            this.sort = $event.sort;            
        }
        let filters: { [index: string]: [string] } = {};
        this.filterInputs.forEach(fi => {
            if (fi.name && this.myForm.get(fi.name)!.value) {
                filters[fi.name] = [this.myForm.get(fi.name)!.value];
            }
        });

        this.queryItems(
            {
                ...filters,
                sort: $event.sort || this.sort,
                page: $event.page - 1
            }
        ).subscribe(
            (res: HttpResponse<IResponse>) => {
                this.items = res.body?.data.content || [];
                this.totalPages = res.body?.data.totalPages;
                this.totalPages
            }
        );
    }

}
