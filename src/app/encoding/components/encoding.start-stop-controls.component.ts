import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { EncodingState } from '../encoding.state';
import { GameInfo, EncodingParameters, EncodingResult } from '../encoding.entity';
import { NotificationService } from '../../shared/services';
import { EncodingService } from '../encoding.service';

@Component({
  selector: 'sn-start-stop-controls',
  templateUrl: './encoding.start-stop-controls.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncodingStartStopControlsComponent implements OnInit {
  @Output() public onBeginEncoding = new EventEmitter(true);
  @Output() public onCancelEncoding = new EventEmitter(true);
  @Output() public onGameInfoRequested = new EventEmitter(true);

  @Input()
  public encodingParameters: EncodingParameters;

  // whether dialog visible.
  public isVisible = false;

  public nodesList$: Observable<any[]>;
  public gameInfo: GameInfo;

  public encodingResult: EncodingResult;

  constructor(private notificationService: NotificationService,
              private encodingService: EncodingService) {

  }

  ngOnInit() {
    const state = this.encodingService.state;
    this.nodesList$ = state.watcher$.map((s: EncodingState) => {
      if (s.encodingNodes) {
        if (!this.encodingParameters.nodeIpAddress || this.encodingParameters.nodeIpAddress === '') {
          this.encodingParameters.nodeIpAddress = s.encodingNodes[0];
        }
        return s.encodingNodes.map(str => {
          return { label: str, value: str };
        });
      }
      return [{}];
    });
    state.watcher$.subscribe((s: EncodingState) => {
      if (s.selectedStb) {
        this.encodingParameters.stbId = s.selectedStb.id;
      }

      if (s.gameInfo) {
        this.gameInfo = {
          gameId: s.gameInfo.iid,
          date: s.gameInfo.date,
          gameName: s.gameInfo.name,
          leagueName: s.gameInfo.league.name
        };
        this.encodingParameters.mongoGameId = s.gameInfo.id;
      } else {
        this.gameInfo = null;
      }
      if (s.encodingResult) {

        this.encodingResult = s.encodingResult;
        this.closeDialog();
      } else {
        this.encodingResult = null;
      }
    });
  }

  public loadGameInfo(e) {
    const that = this;
    // use setTimeout to be sure that actual value had been bound
    setTimeout(() => {
      that.onGameInfoRequested.emit(that.encodingParameters.gameId);
    }, 0);
  }

  public isEncodingRun() {
    return this.encodingResult !== null;
  }

  public showDialog() {
    this.isVisible = true;
  }

  public closeDialog() {
    this.isVisible = false;
  }

  public beginEncoding() {
    if (!this.encodingParameters.gameId || isNaN(parseInt(this.encodingParameters.gameId, 10))) {
      this.notificationService.showWarn('Please set id of game');
      return;
    }

    if (!this.encodingParameters.durationInHours || isNaN(this.encodingParameters.durationInHours)) {
      this.notificationService.showWarn('Please set duration');
      return;
    }

    if (!this.encodingParameters.nodeIpAddress) {
      this.notificationService.showWarn('Please set ip address of node');
      return;
    }
    if (this.encodingParameters.mongoGameId && this.encodingParameters.mongoGameId !== '') {
      this.onBeginEncoding.emit(this.encodingParameters);
    } else {
      const state = this.encodingService.state;
      const that = this;
      const subscriber = state.watcher$.subscribe((s: EncodingState) => {
        if (s.gameInfo) {
          setTimeout(() => { // use timeout to be sure that mongoId had been set
            subscriber.unsubscribe();
            that.onBeginEncoding.emit(that.encodingParameters);
          }, 0);
        }
      });
      setTimeout(() => {
        that.onGameInfoRequested.emit(that.encodingParameters.gameId);
      }, 0);
    }
  }

  public cancelEncoding() {
    this.onCancelEncoding.emit(this.encodingResult.jobId);
  }
}


