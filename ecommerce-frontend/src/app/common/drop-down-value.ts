export class DropDownValue<T, D> {
    constructor(public value: T,
                public index: number,
                public isObjectType: boolean = false,
                public displayValue?: D) {

    }

    getDisplayValue() {
        return this.isObjectType ? this.displayValue : this.value
    }
}
