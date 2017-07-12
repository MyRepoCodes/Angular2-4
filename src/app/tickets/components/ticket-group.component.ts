import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { TicketGroup, IssueType } from '../ticketing.models';


@Component({
  selector: 'sn-ticket-group',
  templateUrl: 'ticket-group.component.html',
  styles: [`section { border: 1px solid black; border-radius: 4px; padding: 20px; margin: 10px; width: 30% }`]
})
export class TicketGroupsComponent implements OnInit {

  @Input() ticketGroups: TicketGroup[];

  @Output() addIssueType = new EventEmitter(false);
  @Output() addTicketGroup = new EventEmitter(false);

  displayDialog = false;
  selectedIssueType = new IssueType();

  constructor(
  ) {
  }

  ngOnInit() {
  }

  addNewTicketGroup(newGroupName) {
    // let newGroup = new TicketGroup(newGroupName.value);
    newGroupName.value = '';
  }

  addNewIssueType(id, issueType) {
    issueType.value = '';
  }

  editIssueType(issueType) {
    this.selectedIssueType = issueType;
    this.displayDialog = true;
  }

  updateIssueType(issueType) {
    const ticketGroup = this.ticketGroups.find( x => x.issueTypes.find( y => y.title === issueType.title) !== undefined);
    const index = ticketGroup.issueTypes.findIndex(x => x.title === issueType.title);
    ticketGroup.issueTypes[index] = issueType;
  }
}
