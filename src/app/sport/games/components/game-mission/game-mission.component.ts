import { Component, OnInit, Input } from '@angular/core';
import { OperationsHttpService } from '../../../../shared/services/operations.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'sn-game-mission',
  templateUrl: 'game-mission.component.html',
  styleUrls: ['game-mission.component.css']
})
export class GameMissionComponent implements OnInit {

  @Input() game;

  constructor(
    private operationsService: OperationsHttpService,
    private notifications: NotificationService
  ) { }

  ngOnInit() {
  }

  create(mission: any) {
    if (this.game && this.game.id) {
      this.operationsService.postMission(this.game.id, mission)
        .subscribe(this.onCreate, this.onError);
    } else {
      let errorMsg = '';
      if (this.game) {
        errorMsg = 'Game ID not set.';
      } else {
        errorMsg = 'Game not selected.';
      }
      this.notifications.showError('Cannot Create Mission', errorMsg);
    }
  }

  private onCreate(result): void {
    if (result.failed) {
      const errorMessage = this.createErrorMsg(result.errors);
      this.notifications.showError('Mission Create Failed', errorMessage, 5);
    }

    this.notifications.showSuccess('Mission Created', 'Success');
  }

  private onError(err: any): void {
    this.notifications.showError('Mission Create Failed', err, 3);
  }

  private createErrorMsg(errors: string[]): string {
    const errorArr = errors || [];
    if (errorArr.length) {
      return errorArr.join(', ');
    }

    return 'No Error Msg.';
  }

}

export class MissionRequest {
  gameIid: number;
  targetNodeIp: string;
  serverId: string;
  serverName: string;
  missionName: string;
  phaseName: string;
  semanticModelId: string;
  workflowId: string;
  connectTimeout: number;

  constructor(gameIid, targetNodeIp, serverId = '', serverName = '',
              missionName = '', phaseName = '', semanticModelId = '', workflowId = '',
              connectTimeout = 0) {
    this.gameIid = gameIid;
    this.targetNodeIp = targetNodeIp;
    this.serverId = serverId;
    this.serverName = serverName;
    this.missionName = missionName;
    this.phaseName = phaseName;
    this.semanticModelId = semanticModelId;
    this.workflowId = workflowId;
    this.connectTimeout = connectTimeout;
  }
}
