import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DropDownValue } from 'src/app/common/drop-down-value';

@Component({
  selector: 'app-form-row',
  templateUrl: './form-row.component.html',
  styleUrls: ['./form-row.component.css']
})
export class FormRowComponent<T> implements OnInit {
  @Input() parentFormGroup!: FormGroup
  @Input() label!: string
  @Input() controlName!: string
  @Input() isDropDown!: boolean
  @Input() dropDownData!: DropDownValue<T>[]
  @Input() hasChangeEvent!: boolean
  @Input() dropDownChangeEvent!: () => void

  constructor() { }

  ngOnInit(): void {
  }

}
