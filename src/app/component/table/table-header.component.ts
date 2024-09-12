import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IHeader, InputTypeEnum } from './table.models';

@Component({
    selector: 'app-table-header',
    templateUrl: './table-header.component.html'
})
export class TableHeaderComponent {

    @Output() executeQuery: EventEmitter<{ page: number, sort?: string[] }> = new EventEmitter();
    @Output() search: EventEmitter<any> = new EventEmitter();
    @Input() myForm!: UntypedFormGroup;
    @Input() header!: IHeader;
    @Input() sort!: string[];

    inputType: any = InputTypeEnum;

    constructor() { }

    clearInput(field: string): void {
        this.myForm.get(field)?.setValue(null);
        this.executeQuery.emit({ page: 1, sort: this.sort });
    }

    onSortChange(field: string): void {
        let order = 'ASC';
        if (this.sort[1] === field) {
            if (this.sort[0] !== 'DESC') {
                order = 'DESC';
            }
        }
        this.sort = [order, field];
        this.executeQuery.emit({ page: 1, sort: this.sort });
    }

    onChange(): void {
        this.executeQuery.emit({ page: 1, sort: this.sort });
    }

    onFilterChange(): void {
        this.executeQuery.emit({ page: 1, sort: this.sort });
    }
}
