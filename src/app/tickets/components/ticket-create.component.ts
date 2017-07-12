import { Component, Input, EventEmitter, Output, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TicketLink, Ticket, TicketGroup } from '../ticketing.models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'sn-ticket-create',
  templateUrl: 'ticket-create.component.html',
  styles: [`
    section { border: 1px solid white; padding: 20px } 
    textarea { width: 100% } 
    .ng-invalid.ng-touched { border-color: #f98496}
    .error-text { color: #f98496}`
  ]
})
export class TicketCreateComponent implements OnChanges, OnInit {

  @Input() ticketGroups: TicketGroup[];
  @Output() submitTicket = new EventEmitter<Ticket>(false);

  @Input() set gameLink(gameLink: TicketLink) {
    if (gameLink) {
      this.addLink(gameLink.name, gameLink.url);
    }
  };

  selected$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  ticketForm: FormGroup;
  dropDownItems;
  issueOptions: string[];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.ticketForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: [[]],
      links: [[]],
      ticketGroup: ['', Validators.required]
    });

    this.selected$.subscribe(selected => {
      this.issueOptions = this.getIssueTypesForTicketGroup(selected);
    });
  }

  ngOnChanges(changes: any) {
    if (this.ticketGroups && this.ticketGroups.length > 0) {
      this.dropDownItems = this.mapToDropdownItems(this.ticketGroups);
    }
  }

  onTicketGroupChange(newVal) {
    this.selected$.next(newVal);
  }

  onSubmit(v) {
    this.submitTicket.emit(this.ticketForm.value);
  }

  addLink(name, url) {
    const newLink = new TicketLink(name, url);
    const linksKey = 'links';
    const links = <FormControl>this.ticketForm.controls[linksKey];
    links.setValue([...links.value, newLink]);
  }

  captureLink(name, url) {
    this.addLink(name.value, url.value);
    name.value = '';
    url.value = '';
  }

  removeLink(name) {
    const linksKey = 'links';
    const links = <FormControl>this.ticketForm.controls[linksKey];
    links.setValue(
      links.value.filter(link => link.name !== name)
    );
  }

  private mapToDropdownItems(ticketGroups: TicketGroup[]) {
    return ticketGroups.map(tg => {
      return { label: tg.name, value: tg.name };
    });
  }

  private getIssueTypesForTicketGroup(value) {
    const ticketGroups = this.ticketGroups;
    const ticketGroup = ticketGroups.filter(tg => tg.name === value)[0];
    return ticketGroup ? ticketGroup.issueTypes.map( t => t.title) : [];
  }
}

