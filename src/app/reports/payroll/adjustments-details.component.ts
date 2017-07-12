import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sn-adjustments-details',
  // templateUrl: 'adjustments-details.component.html'
  template: `
<div>
  <table>
    <tr>
      <th>Value</th>
      <th>Note</th>
      <th>Controls</th>
    </tr>
    <tr *ngFor="let adj of adjustments">
      <td>{{adj.value}}</td>
      <td>{{adj.note}}</td>
      <td>
        <button>Edit</button>
        <button>Delete</button>
      </td>
    </tr>
  </table>
  <button>Add</button>
</div>
      `,
  styles: [
    `
table {
  border: 1px solid black;
  border-collapse: collapse;
}

th, td {
  padding: 5px;
  text-align: left;
  border: 1px solid black;
}
    `
  ]
})
export class AdjustmentsDetailsComponent implements OnInit {
  @Input() adjustments;

  constructor() {
  }

  ngOnInit() {
  }

}
