import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { IHeader, InputTypeEnum } from './table.models';
import { IResponse } from 'src/app/models/response.models';
import { IListItem } from 'src/app/models/list.models';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

    @Output() search: EventEmitter<any> = new EventEmitter();
    @Input() queryItems!: (req?: any) => Observable<HttpResponse<IResponse>>;
    @Input() headers: IHeader[] = [];
    @Input() myForm!: UntypedFormGroup;
    @Input() sort!: string[];
    @Input() hasButtons: boolean = false;
    @Input() page: number = 1;
    @Input() bodyTemplate!: TemplateRef<any>;
    @Input() itemsAutocomplete!: IListItem[];

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
        this.headers.forEach(header => {
            if (header.inputName && this.myForm.get(header.inputName)!.value) {
                filters[header.inputName] = [this.myForm.get(header.inputName)!.value];
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

    onSearch(event: any): void {
        this.search.emit(event);
    }
}
