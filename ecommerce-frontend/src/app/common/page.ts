export class Page {
    size: number = 5
    totalElements: number = 0
    number: number = 1

    constructor(pageSize?: number, totalElements?: number, number?: number) {
        this.size = pageSize ? pageSize : 5
        this.totalElements = totalElements ? totalElements : 0
        this.number = number ? number : 1
    }

    updatePageSize(pageSize: number, onPageEvent: () => void) {
        this.size = pageSize
        onPageEvent()
    }
}
