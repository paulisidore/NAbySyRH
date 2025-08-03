import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-editable-table',
  templateUrl: './editable-table.component.html',
  styleUrls: ['./editable-table.component.scss'],
})
export class EditableTableComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });

    this.addRow(); // ajouter une ligne par défaut
  }

  get rows(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const row = this.fb.group({
      nom: [''],
      age: ['']
    });
    this.rows.push(row);
  }

  removeRow(index: number) {
    this.rows.removeAt(index);
  }

  onSubmit() {
    console.log(this.form.value);
  }
}
