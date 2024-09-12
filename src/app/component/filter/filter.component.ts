import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IInput, InputTypeEnum } from './filter.models';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent {

    @Output() submit: EventEmitter<void> = new EventEmitter();
    @Output() clear: EventEmitter<void> = new EventEmitter();
    @Input() myFormFilter!: FormGroup;
    @Input() filterInputs!: IInput[];
    @Input() isSearching!: boolean;

    inputType: any = InputTypeEnum;

    constructor() { }

    onClear(): void {
        this.clear.emit();
    }

    onSearch(input: IInput, event: any): void {
        if (input.onSearch) {
            input.onSearch(event);            
        }
    }

    onSubmit(): void {
        this.submit.emit();
    }
}
