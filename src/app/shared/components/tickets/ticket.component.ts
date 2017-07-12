import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { orderBy } from '../../../shared/utils/ArrayUtils';
import { TicketsComponent } from './tickets.component';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { HttpTicketingService } from '../../../tickets/module/ticketing.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ConfirmationService } from 'primeng/components/common/api';
// type EditMode = 'create' | 'edit';
const emptyTicket = {
  result: {
    id: '',
    title: '',
    description: '',
    template: '',
    group: '',
    priority: ''
  }
};
const emptyLink = {
  refId: '',
  type: '',
};

@Component({
  selector: 'sn-ticket',
  templateUrl: 'ticket.component.html'
})

export class TicketComponent implements OnInit, OnDestroy {
  @Input() filter;
  public mode;
  ticketFilter = {
    ticketName: '',
    templateId: '',
    groupId: '',
    linkId: '',
    linkType: ''
  };
  private availableLinksTypeOptions = [
    { label: 'Select links type', },
    { label: 'Sport', value: 'Sport' },
    { label: 'League', value: 'League' },
    { label: 'Conference', value: 'Conference' },
    { label: 'Divisions', value: 'Divisions' },
    { label: 'Teams', value: 'Teams' },
    { label: 'Players', value: 'Players' },
    { label: 'Games', value: 'Games' },
    { label: 'Seasons', value: 'Seasons' },
    { label: 'Competition', value: 'Competition' },
    { label: 'Venues', value: 'Venues' },
  ];
  private availablePriorityOptions = [
    { label: 'Select Priority type', },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];
  private sub: Subscription;
  public form: FormGroup;
  ticket: any = emptyTicket.result;
  tickets: any;
  priority;
  title;
  loading: boolean;
  templates: any [];
  template: any;
  data;
  link: any [] = [];
  group: any;
  groups: any [];
  linkTypes: any [] = [];
  private templatesCache: any[] = [];
  private groupsCache: any[] = [];
  private emptyTemplates = [{ label: 'Select Template', value: '' }];
  private emptyGroups = [{ label: 'Select Group', value: '' }];
  ticketName;
  templateId;
  groupId;
  linkId;
  linkType;
  isTicket;
  isTickets;
  isComment;
  relatedTicket: any[] = [];
  prioritys: any[] = [];
  relatedTicketLink: any[] = [];
  @ViewChild('TicketsComponent') goToPage: TicketsComponent;
  constructor(
    private ticketingService: HttpTicketingService,
    public builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationService,
    private confirmationService: ConfirmationService,
    private location: Location,
  ) {
    this.form = this.builder.group({
      _id: [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      links: this.builder.array([]),
      template: ['', Validators.required],
      group: ['', Validators.required],
      priority: ['', Validators.required]
    });
      this.ticket = emptyTicket.result;
  }

  ngOnInit(searchFilter?) {
    this.linkTypes = this.availableLinksTypeOptions;
    this.prioritys = this.availablePriorityOptions;
    this.mode = this.route.snapshot.data['mode'];
    if (this.mode || this.filter && !searchFilter) {
      if (this.mode === 'create') {
        this.title = 'Create Ticket';
        this.mode = this.mode;
        this.addLink();
      } else if (this.filter && this.filter.mode === 'create') {
        this.title = 'Create Ticket';
        this.mode = this.filter.mode;
        this.ticketFilter.linkType = this.filter.link;
        this.ticketFilter.ticketName = this.filter.ticketID;
        this.addLink();
      } else {
        this.title = 'Edit Ticket';
        if (this.filter) {
          this.mode = 'FilterEdit';
          this.ticketFilter.linkType = this.filter.link;
          this.ticketFilter.ticketName = this.filter.ticketID;
        }
      }
    } else {
      this.mode = 'other';
      this.title = 'Edit Ticket';
      if (searchFilter) {
        this.ticketFilter.linkType = searchFilter.linkType;
        this.ticketFilter.ticketName = searchFilter.ticketName;
      }
    }

    const obsComb = Observable.combineLatest(this.route.params, this.route.queryParams,
      (params, qparams) => ({ params, qparams }));
    obsComb.subscribe(data => {

      if (data.params['name']) {
        this.ticketFilter.ticketName = data.params['name'];
      }
      if (data.qparams['template']) {
        this.ticketFilter.templateId = data.qparams['template'];
      }
      if (data.qparams['group']) {
        this.ticketFilter.groupId = data.qparams['group'];
      }
      if (data.qparams['linkId']) {
        this.ticketFilter.linkId = data.qparams['linkId'];
      }
      if (data.qparams['linkType']) {
        this.ticketFilter.linkType = data.qparams['linkType'];
      }
    });

    this.sub = this.route.queryParams
      .do(() => this.loading = true)
      .mergeMap(
        params => {
          if (this.mode === 'create') {
            return this.ticketingService.getTicketWithTemplateAndGroups(this.ticketFilter);
          } else if (this.mode === 'other') {
            return this.ticketingService.getTicketWithTemplateAndGroups(searchFilter,
            );
          } else {
            return this.ticketingService.getTicketWithTemplateAndGroups(this.ticketFilter);
          }
        }, (params, ticket) => ({ params: params, ticket: ticket })
      ).subscribe(this.onSuccess, this.onError);
  }

  initLink() {
    return this.builder.group({
      refId: ['', Validators.required],
      type: ['', Validators.required],
    });
  }

  onCancel() {
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.router.navigate(['../list'], { relativeTo: this.route });
    } else {
      // this.isTicket = true;
      // this.isComment = false;
      // this.isTickets = true;
      // this.ticketsComponent.test();

    }
  }

  onLinkChange(link) {
    if (this.relatedTicketLink.indexOf(link) === -1) {
      this.relatedTicketLink.push(link);
    }
    this.ticketingService.getRelatedTicket(link).subscribe(
      result => {
        this.relatedTicket = result.tickets;
      },
      err => this.notifications.showError('Cannot Create Ticket', err.toString()));
  }

  addLink() {
    const control = <FormArray>this.form.controls['links'];
    control.push(this.initLink());
    if (control.length > 1) {
      const link = emptyLink;
      this.link.push(link);
    }
  }

  removeLink(i: number) {
    const control = <FormArray>this.form.controls['links'];
    if (control.length > 1) {
      control.removeAt(i);
      this.link.splice(i, 1);
    }
  }

  onSuccess = (result: any): void => {
    this.link = [];
    this.templatesCache = result.ticket[0];
    const templates = result.ticket[0].map(s => ({ label: s.name, value: s.id }));
    this.templates = this.emptyTemplates.concat(orderBy(templates, 'label'));
    this.groupsCache = result.ticket[1];
    const groups = this.groupsCache.map(s => ({ label: s.name, value: s.id }));
    this.groups = this.emptyGroups.concat(orderBy(groups, 'label'));
    if (this.mode === 'create') {
      this.ticket = emptyTicket.result;
      if (result.params) {
        if (result.params.template) {
          const template = this.templatesCache.filter(c => c.type === result.params.template.toLowerCase())[0];
          this.ticket.template = template.id;
        }
        if (result.params.group) {
          const group = this.groupsCache.filter(c => c.name === result.params.group)[0];
          this.ticket.group = group.id;
        }
      }
      this.ticket.groupId = result.params.group ? result.params.group : '';
      if (result.ticket[2]) {
        this.relatedTicket = result.ticket[2].tickets;
      }
      let link = emptyLink;
      if (this.templateId) {
        const template = this.templatesCache.filter(c => c.type === this.templateId)[0];
        this.ticket.template = template.id;
      }
      if (this.groupId) {
        const group = this.groupsCache.filter(c => c.name === this.groupId)[0];
        this.ticket.group = group.id;
      }

      if (this.linkId && this.linkType && !this.filter) {
        link = {
          'refId': result.params.linkId,
          'type': result.params.linkType
        };
        this.link.push(link);
      } else if (this.filter) {
        link = {
          'refId': this.filter.linkRef,
          'type': this.filter.link
        };
        this.link.push(link);
      } else if (result.params) {
        link = {
          'refId': result.params.linkId,
          'type': result.params.linkType
        };
        this.link.push(link);
      } else {
        this.link.push(emptyLink);
      }
    } else {
      this.ticket = result.ticket[2][0];
      this.relatedTicket = result.ticket[3].tickets;
      const template = this.templatesCache.filter(c => c.abbr === this.ticket.template.abbr)[0];
      this.ticket.template = template.id;
      let link;
      for (let i = 0; i < this.ticket.links.length; i++) {
        if (this.mode === 'edit' || this.mode === 'FilterEdit') {
          const control = <FormArray>this.form.controls['links'];
          if (control.length < i + 1) {
            this.addLink();
          }
        }
        link = {
          'refId': this.ticket.links[i].refId,
          'type': this.ticket.links[i].type
        };
        this.link.push(link);
      }
    }
    this.loading = false;
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load tickets', 3);
  }

  onSubmit(tickets) {
    const template = this.templatesCache.filter(c => c.id === tickets.template)[0];
    const toUpdate = Object.assign(
      {},
      this.ticket,
      { links: tickets.links });
    toUpdate.template = template.type;
    if (this.mode === 'create') {
      this.ticketingService.postTicket(toUpdate).subscribe(
        result => {
          this.notifications.showSuccess('Ticket Created');
          const data = JSON.parse(result);
          const Url = this.location.path();
          if (Url.indexOf('tickets') !== -1) {
            this.router.navigate(['../', data.name], {
              queryParams: { linkType: data.links[0].type },
              relativeTo: this.route
            });
          } else {
            this.ticketFilter.ticketName = data.name;
            this.ticketFilter.linkType = data.links[0].type;
            this.ngOnInit(this.ticketFilter);
          }

        },
        err => this.notifications.showError('Cannot Create Ticket', err.toString()));
    } else {
      this.ticketingService.putTicket(toUpdate).subscribe(
        result => {
          this.notifications.showSuccess('Ticket Updated');
          const data = result;
          const Url = this.location.path();
          if (Url.indexOf('tickets') !== -1) {
            this.router.navigate(['../', data.name], {
              queryParams: { linkType: data.links[0].type },
              relativeTo: this.route
            });
          } else {
            this.ticketFilter.ticketName = data.name;
            this.ticketFilter.linkType = data.links[0].type;
            this.ngOnInit(this.ticketFilter);
          }
        },
        err => this.notifications.showError('Cannot Updated Ticket', err.toString()));
    }
  }

  onDelete(ticketId) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete Ticket?',
      accept: () => {
        this.ticketingService.deleteTicket(ticketId).subscribe(
          () => {
            this.notifications.showSuccess('Ticket Deleted');
            this.router.navigate(['../list'], { relativeTo: this.route });
          },
          err => this.notifications.showError('Cannot Delete Ticket', err.toString())
        );
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
