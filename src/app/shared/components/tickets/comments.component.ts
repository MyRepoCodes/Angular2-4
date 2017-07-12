import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import {TicketsComponent} from './tickets.component';
import { HttpTicketingService } from '../../../tickets/module/ticketing.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'sn-comments',
  templateUrl: 'comments.component.html'
})

export class CommentsComponent implements OnInit, OnDestroy {
  @Input() filter;
  comments: any[];
  comment: any;
  loading: boolean;
  ticketId: string;
  title: string;
  currentUser: any;
  public form: FormGroup;
  private sub: Subscription;
  public commenttext: string;
  ticket: any;
  history: any;
  mode;
  public isDisplay: boolean;
  public isEdit: boolean;

  constructor(
    public builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ticketingService: HttpTicketingService,
    private notifications: NotificationService,
    private authService: AuthService,
    // public ticketsComponent: TicketsComponent,
    private location: Location
  ) {
    this.loading = false;
    this.createForm();
  }

  createForm() {
    this.form = this.builder.group({
      commenttext: ['', Validators.required],
      ticketId: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.filter) {
      this.mode = 'other';
    }
    this.isDisplay = true;
    this.currentUser = this.authService.currentUser();
    this.loading = true;
    this.title = 'Ticket comments ';
    this.sub = this.route.params
      .do(() => this.loading = true)
      .map(params => {
        return {
          ticketID: params['id']
        };
      })
      .mergeMap(
        params => {
          if (this.mode === 'other') {
            return this.ticketingService.getComments(this.filter.ticketID);
          } else {
            return this.ticketingService.getComments(params.ticketID);
          }
        },
        (params, comments) => ({ params: params, comments: comments }))
      .subscribe(this.onSuccess, this.onError);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSuccess = (result: any): void => {
    this.comments = result.comments[1];
    this.ticket = result.comments[0][0];
    this.history = result.comments[0][0].history;
    this.ticketId = this.ticket.name;
    this.commenttext = '';
    // this.createForm();
    this.loading = false;
  }

  onBack() {
    const Url = this.location.path();
    if (Url.indexOf('tickets') !== -1) {
      this.location.back();
    } else {
      // this.ticketsComponent.ngOnInit();
    }
  }

  onSubmit(comment) {
    const toUpdate = Object.assign(
      {},
      { body: comment.commenttext },
      { ticketId: this.ticketId }
    );
    this.ticketingService.postComment(toUpdate).subscribe(
      result => {
        const data = JSON.parse(result);
        if (data._id) {
          this.notifications.showSuccess('Comment Created');
          this.ngOnInit();
          // this.router.navigate(['../../comment/', this.ticket.name], { relativeTo: this.route });
        } else {
          this.notifications.showError('Cannot Create Comment');
        }
      },
      err => this.notifications.showError('Cannot Create Comment', err.toString())
    );
  }

  onUpdate(comment, commentId, index) {
    const toUpdate = Object.assign(
      {},
      { comment: comment },
      { commentId: commentId }
    );
    this.comments[index].isEdit = false;
    this.comments[index].isDisplay = false;
    this.ticketingService.putComment(toUpdate, this.ticket.id).subscribe(
      () => {
        this.notifications.showSuccess('Comment Updated');
        this.ngOnInit();
      },
      err => this.notifications.showError('Cannot Update Comment', err.toString())
    );
  }

  onError = (err: any): void => {
    this.loading = false;
    this.notifications.showError('Error', 'Cannot load Comments', 3);
  }

  onClick(index, user) {
    if (this.currentUser.username === user) {
      this.isEdit = false;
      this.comments[index].isEdit = true;
      this.comments[index].isDisplay = true;
    }
  }

  onCancel(index) {
    this.comments[index].isEdit = false;
    this.comments[index].isDisplay = false;
  }
}



