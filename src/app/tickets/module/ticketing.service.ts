import { ApiTicketService } from './api.service';
import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/api/api.service';
import {
  API_TEMPLATE_URL,
  API_TICKET_URL,
  API_GROUP_URL,
  postCommentByTicketName,
  getCommentByTicketName,
  updateCommentByTicketName,
  getRelatedTicket, ticketByName,
  setStatus, assingUser
} from '../../shared/api/api.urls';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Filter, createArrayParamFilter } from '../../shared/fitler';
import { isUndefined } from 'util';

type Page = { number: number, size: number };
const defaultPage: Page = { number: 1, size: 100 };
type CollectionResult = Observable<{ result: any[], totalRecords: number }>;
const emptyCollectionResult: CollectionResult = Observable.of({ result: [], totalRecords: 0 });
type Result = Observable<{ result: any }>;
const emptyObservable: Observable<any> = Observable.of(null);

@Injectable()
export class HttpTicketingService {
  constructor(
    private apiTicketService: ApiTicketService,
    private apiService: ApiService
  ) {
  }

  public getTemplate(id: string = null): Observable<any> {
    return this.apiTicketService.getEntityById(API_TEMPLATE_URL, id)
      .catch(err => emptyObservable);
  }

  public postTicket(ticket): Observable<any> {
    return this.apiTicketService.postEntity(API_TICKET_URL, ticket);
  }

  public putTicket(ticket): Observable<any> {
    return this.apiTicketService.putEntity(API_TICKET_URL, ticket.id, ticket);
  }

  public deleteTicket(id): Observable<any> {
    return this.apiTicketService.deleteEntity(API_TICKET_URL, id);
  }

  public getTickets(ticket, page: Page = defaultPage): Observable<any> {
    const search = Filter.fromPaging(page.number, page.size);
    const params = new Map<string, any>();
    if (ticket.name) {
      params.set('name', ticket.name);
    }
    if (ticket.group) {
      params.set('group', ticket.group);
    }
    if (ticket.assignee) {
      params.set('assignee', ticket.assignee);
    }
    if (ticket.template) {
      params.set('template', ticket.template);
    }
    if (ticket.status) {
      params.set('status', ticket.status);
    }
    if (ticket.link) {
      params.set('link', ticket.link);
    }
    if (ticket.linkType) {
      params.set('link', ticket.linkType);
    }
    if (ticket.linkRef) {
      params.set('refId', ticket.linkRef);
    }
    if (ticket.priority) {
      params.set('priority', ticket.priority);
    }
    params.set('take', search.take);
    params.set('skip', search.skip);
    const ticketUrl = this.apiTicketService.searchEntities(API_TICKET_URL, params);
    const groupUrl = this.apiTicketService.getEntityById(API_GROUP_URL, null);
    const templateUrl = this.apiTicketService.getEntityById(API_TEMPLATE_URL, null);
    return Observable.forkJoin([
      templateUrl,
      groupUrl,
      ticketUrl,
    ]);
  }

  public getGroups(id: string = null): Observable<any> {
    return this.apiTicketService.getEntityById(API_GROUP_URL, id)
      .catch(err => emptyObservable);
  }

  public postassingUser(ticket) {
    const ticketData = ticket.split('-');
    return this.apiTicketService.postEntity(assingUser(ticketData[0], ticketData[1]), '');
  }

  public getTicketWithTemplateAndGroups(ticket, page: Page = defaultPage): Observable<any> {
    let ticketUrl;
    if (ticket.ticketName) {
      const ticketData = ticket.ticketName.split('-');
      ticketUrl = this.apiTicketService.getEntityById(ticketByName(ticketData[0], ticketData[1]), null);
    }
    const groupUrl = this.apiTicketService.getEntityById(API_GROUP_URL, null);
    const templateUrl = this.apiTicketService.getEntityById(API_TEMPLATE_URL, null);
    let relatedTicketUrl;
    if (ticket.linkType) {
      relatedTicketUrl = this.apiTicketService.getEntityById(getRelatedTicket(ticket.linkType), null);
    }
    console.log(relatedTicketUrl);
    if (ticket.linkType && ticket.ticketName) {
      return Observable.forkJoin([
        templateUrl,
        groupUrl,
        ticketUrl,
        relatedTicketUrl
      ]);
    } else if (ticket.ticketName) {
      return Observable.forkJoin([
        templateUrl,
        groupUrl,
        ticketUrl,
      ]);
    } else if (ticket.linkType) {
      return Observable.forkJoin([
        templateUrl,
        groupUrl,
        relatedTicketUrl
      ]);
    } else {
      return Observable.forkJoin([
        templateUrl,
        groupUrl
      ]);
    }
  }

  public getRelatedTicket(linkType): Observable<any> {
    if (linkType) {
      return this.apiTicketService.getEntityById(getRelatedTicket(linkType), null);
    }
  }

  public postComment(comment): Observable<any> {
    const ticketData = comment.ticketId.split('-');
    return this.apiTicketService.postEntity(postCommentByTicketName(ticketData[0], ticketData[1]), comment);
  }

  public putComment(comment, ticketId: string = null): Observable<any> {
    return this.apiTicketService.putEntity(
      updateCommentByTicketName(ticketId), comment.commentId, comment);
  }

  public getComments(TicketName: string = null): Observable<any> {
    const ticketUrl = this.apiTicketService.getEntityById(API_TICKET_URL, TicketName);
    const ticketData = TicketName.split('-');
    const commentUrl = this.apiTicketService.getEntityById(getCommentByTicketName(ticketData[0], ticketData[1]), null);
    return Observable.forkJoin([
      ticketUrl,
      commentUrl
    ]);
  }

  public postStatus(status): Observable<any> {
    const statusData = status.ticketId.split('-');
    return this.apiTicketService.postEntity(setStatus(statusData[0], statusData[1]), status);
  }
}
