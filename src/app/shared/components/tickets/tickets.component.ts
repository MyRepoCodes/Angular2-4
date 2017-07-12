import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HttpTicketingService } from '../../../tickets/module/ticketing.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { MenuItem } from 'primeng/primeng';
import { Location } from '@angular/common';
import { AuthService } from '../../../auth/auth.service';
import { orderBy } from '../../../shared/utils/ArrayUtils';
import { FilterUtils } from '../../../shared/utils/filter-utils';
import { Validators, FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

const emptyTicket = {
  result: {
    name: '',
    assignee: '',
    template: '',
    link: '',
    group: '',
    status: '',
    priority: '',
    linkRef: '',
  }
};

@Component({
  selector: 'sn-tickets',
  templateUrl: 'tickets.component.html'
})

export class TicketsComponent implements OnInit, OnDestroy {
  @Input() filter;
  mode;
  page: { number: number, size: number };
  tickets: any[];
  total: number;
  public form: FormGroup;
  links: any[];
  status: any[];
  loading: boolean;
  title: string;
  priority;
  currentUser;
  private sub: Subscription;
  private items: MenuItem[];
  templates: any[];
  prioritys: any[] = [];
  private templatesCache: any[] = [];
  private groupsCache: any[] = [];
  private emptyTemplates = [{ label: 'Select Template', value: '' }];
  private emptyGroups = [{ label: 'Select Group', value: '' }];
  isComment: boolean;
  isTickets: boolean;
  isTicket: boolean;
  isLinkDisable: boolean;
  commentFilter = {
    ticketID: ''
  };
  ticketFilter = {
    ticketID: '',
    mode: '',
    link: '',
    linkRef: ''
  };
  ticketParams = {
    name: '',
    assignee: '',
    template: '',
    link: '',
    group: '',
    status: '',
    priority: '',
  };
  groups: any[];
  ticket: any = emptyTicket.result;
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
  private availableStatusOptions = [
    { label: 'Select status', },
    { label: 'Created', value: 'Created' },
    { label: 'Open', value: 'Open' },
    { label: 'In-progress', value: 'In-progress' },
    { label: 'Done', value: 'Done' },
    { label: 'Closed', value: 'Closed' },
    { label: 'Need-more-info', value: 'Need-more-info' },
  ];
  private availablePriorityOptions = [
    { label: 'Select priority type', },
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ticketingService: HttpTicketingService,
    private notifications: NotificationService,
    public builder: FormBuilder,
    private location: Location,
    private authService: AuthService,
  ) {
    this.loading = false;
    this.page = { number: 1, size: 25 };
    this.form = this.builder.group({
      name: [''],
      assignee: [''],
      link: [''],
      template: [''],
      group: [''],
      status: [''],
      priority: ['']
    });
    this.clearFilter();
  }

  ngOnInit(searchParams?) {
    if (this.filter) {
      this.isLinkDisable = true;
    }
    this.prioritys = this.availablePriorityOptions;
    this.isTickets = true;
    this.isTicket = false;
    this.isComment = false;
    if (this.filter) {
      this.mode = 'other';
      this.ticket.link = this.ticket.link ? this.ticket.link : this.filter.linkType;
      this.ticket.refId = this.ticket.link ? this.ticket.link : this.filter.linkRef;
    }
    if (searchParams) {
      this.mode = 'search';
      this.ticket.link = searchParams.link ? searchParams.link : null;
    }
    this.loading = true;
    this.links = this.availableLinksTypeOptions;
    this.status = this.availableStatusOptions;
    this.ticket = emptyTicket.result;

    this.title = 'Ticket  List';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          name: params['name'],
          template: params['template'],
          assignee: params['assignee'],
          priority: params['priority'],
          group: params['group'],
          status: params['status'],
          link: params['link'],
          page: +params['page'] || 1,
          size: +params['size'] || 25
        };
      })
      .mergeMap(
        params => {
          if (params) {
            if (params.name) {
              this.ticketParams.name = params.name;
            }
            if (params.template) {
              this.ticketParams.template = params.template;
            }
            if (params.assignee) {
              this.ticketParams.assignee = params.assignee;
            }
            if (params.priority) {
              this.ticketParams.priority = params.priority;
            }
            if (params.group) {
              this.ticketParams.group = params.group;
            }
            if (params.status) {
              this.ticketParams.status = params.status;
            }
            if (params.link) {
              this.ticketParams.link = params.link;
            }
          }
          if (this.mode === 'other') {
            return this.ticketingService.getTickets(this.filter, { number: this.page.number, size: this.page.size });
          } else if (this.mode === 'search') {
            return this.ticketingService.getTickets(searchParams, { number: this.page.number, size: this.page.size });
          } else {
            return this.ticketingService.getTickets(params, { number: params.page, size: params.size });
          }
        }, (params, tickets) => ({ params: params, tickets: tickets })
      ).subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSuccess = (result: any): void => {
    this.templatesCache = result.tickets[0];
    const templates = result.tickets[0].map(s => ({ label: s.name, value: s.id }));
    this.templates = this.emptyTemplates.concat(orderBy(templates, 'label'));
    this.groupsCache = result.tickets[1];
    const groups = result.tickets[1].map(s => ({ label: s.name, value: s.id }));
    this.groups = this.emptyGroups.concat(orderBy(groups, 'label'));
    this.tickets = result.tickets[2].tickets;
    if (this.mode === 'search') {
      this.page = {
        number: this.page.number,
        size: this.page.size
      };
    } else {
      this.page = {
        number: result.params.page ? result.params.page : this.page.number,
        size: result.params.size ? result.params.size : this.page.size
      };
    }
    this.total = result.tickets[2].totalRecord;
    this.loading = false;
    this.items = [
      { label: 'Created', icon: 'fa-plus-circle' },
      { label: 'Open', icon: 'fa-envelope-open-o' },
      { label: 'In-progress', icon: 'fa-tasks' },
      { label: 'Done', icon: 'fa-check-circle-o' },
      { label: 'Closed', icon: 'fa-times-circle-o' },
      { label: 'Need-more-info', icon: 'fa-info' }
    ];
    this.currentUser = this.authService.currentUser();
    console.log(this.currentUser);
  }

  search(data?) {
    let searchParams;
    if (data) {

      this.page.number = 1;
      const toUpdate = Object.assign(
        {},
        emptyTicket.result,
      );
      if (data.name) {
        toUpdate.name = data.name;
      }
      if (data.assignee) {
        toUpdate.assignee = data.assignee;
      }
      if (data.template) {
        const template = this.templatesCache.filter(c => c.id === data.template)[0];
        toUpdate.template = template.abbr;
      }
      if (this.ticket.template) {
        const template = this.templatesCache.filter(c => c.id === this.ticket.template)[0];
        toUpdate.template = template.abbr;
      }
      if (data.priority) {
        toUpdate.priority = data.priority;
      }
      if (data.link) {
        toUpdate.link = data.link;

      }
      if (this.filter) {
        toUpdate.linkRef = this.filter.linkRef;
      }
      if (data.group) {
        toUpdate.group = data.group;
      }
      if (data.status) {
        toUpdate.status = data.status;
      }
      searchParams = FilterUtils.createSearchParams(
        toUpdate
      );
    } else {
      let templateAbbr;
      let groupName;
      if (this.ticket.template) {
        const template = this.templatesCache.filter(c => c.id === this.ticket.template)[0];
        templateAbbr = template.abbr;
      }
      if (this.ticket.group) {
        const group = this.groupsCache.filter(c => c.id === this.ticket.group)[0];
        groupName = group.id;
      }
      this.page.number = 1;
      searchParams = FilterUtils.createSearchParams({
        name: this.ticket.name,
        priority: this.ticket.priority,
        group: groupName ? groupName : this.ticket.group,
        template: templateAbbr ? templateAbbr : this.ticket.template,
        status: this.ticket.status,
        assignee: this.ticket.assignee,
        link: this.ticket.link,
      });
    }
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.router.navigate(['../list', searchParams], { relativeTo: this.route });
    } else {
      this.ngOnInit(searchParams);
    }

  }

  onAdd(data) {
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      if (data) {
        this.router.navigate(['/create'], {
          queryParams: { template: data.template, group: data.group, linkId: data.linkId, linkType: data.linkType },
          relativeTo: this.route
        });
      } else {
        this.router.navigate(['../create'], { relativeTo: this.route });
      }
    } else {
      this.ticketFilter.ticketID = '';
      this.ticketFilter.mode = 'create';
      this.ticketFilter.link = this.filter.linkType;
      this.ticketFilter.linkRef = this.filter.linkRef;
      this.isComment = false;
      this.isTickets = false;
      this.isTicket = true;
    }
  }

  onComment(id) {
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.router.navigate(['../comment/', id], { relativeTo: this.route });
      this.commentFilter.ticketID = id;
    } else {
      this.commentFilter.ticketID = id;
      this.isTickets = false;
      this.isTicket = false;
      this.isComment = true;
    }
  }

  onEdit(ticket) {
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      const link = ticket.links[0].type ? ticket.links[0].type : '';
      this.router.navigate(['../', ticket.name], {
        queryParams: { linkType: link },
        relativeTo: this.route
      });
    } else {
      this.ticketFilter.ticketID = ticket.name;
      this.ticketFilter.mode = 'edit';
      this.ticketFilter.link = ticket.links[0].type;
      this.ticketFilter.linkRef = '';
      this.isComment = false;
      this.isTickets = false;
      this.isTicket = true;
    }
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load tickets', 3);
  }

  clearFilter() {
    this.ticket.name = '';
    this.ticket.assignee = '';
    this.ticket.template = '';
    this.ticket.link = '';
    this.ticket.group = '';
    this.ticket.status = '';
    this.ticket.priority = '';
    this.search();
  }

  toggle(event, name) {
    console.log(event.target.innerText);
    const toUpdate = Object.assign(
      {},
      { status: event.target.innerText, ticketId: name });

    this.ticketingService.postStatus(toUpdate).subscribe(
      result => {
        this.ngOnInit();
      },
      err => this.notifications.showError('Cannot Create Ticket', err.toString()));
  }

  goToPage(p: any) {
    this.page = { number: p.page, size: p.size };
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.changePage();
    } else {
      this.changePage(this.page);
    }
  }

  changePage(data?) {
    let searchParams;
    if (data) {
      const link = this.filter.linkType;
      const refId = this.filter.linkRef;
      searchParams = FilterUtils.createSearchParams({
        page: data.number,
        size: data.size,
        link: link,
        refId: refId
      });
    } else {
      searchParams = FilterUtils.createSearchParams({
        name: this.ticketParams.name,
        priority: this.ticketParams.priority,
        group: this.ticketParams.group,
        template: this.ticketParams.template,
        status: this.ticketParams.status,
        assignee: this.ticketParams.assignee,
        link: this.ticketParams.link,
        page: this.page.number,
        size: this.page.size
      });
    }
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.router.navigate(['../list', searchParams], { relativeTo: this.route });
    } else {
      this.ngOnInit(searchParams);
    }
  }

  assingUser(ticket) {
    this.ticketingService.postassingUser(ticket).subscribe(
      result => {
        this.notifications.showSuccess('Ticket Assigned');
        const data = result;
        const Url = this.location.path();
        let searchParams;
        if (Url.indexOf('tickets') !== -1) {
          let templateAbbr;
          let groupName;
          if (this.ticket.template) {
            const template = this.templatesCache.filter(c => c.id === this.ticket.template)[0];
            templateAbbr = template.abbr;
          }
          if (this.ticket.group) {
            const group = this.groupsCache.filter(c => c.id === this.ticket.group)[0];
            groupName = group.id;
          }
          searchParams = FilterUtils.createSearchParams({
            name: this.ticket.name,
            priority: this.ticket.priority,
            group: groupName ? groupName : this.ticket.group,
            template: templateAbbr ? templateAbbr : this.ticket.template,
            status: this.ticket.status,
            assignee: this.ticket.assignee,
            link: this.ticket.link,
            page: this.page.number,
            size: this.page.size
          });
          this.router.navigate(['./', searchParams], { relativeTo: this.route });
        } else {
          this.ngOnInit();
        }

      },
      err => this.notifications.showError('Cannot Assigned Ticket', err.toString()));
  }
}



