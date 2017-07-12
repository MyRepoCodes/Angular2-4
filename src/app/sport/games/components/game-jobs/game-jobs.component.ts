import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../../../shared/services/notification.service';
import { OperationsHttpService } from '../../../../shared/services/operations.service';
import { JobStatus, Job } from '../../job.entity';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { UserRef } from '../../../../auth/user.models';
import { MissionRequest } from '../game-mission/game-mission.component';
import { AuthService } from '../../../../auth/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'sn-game-jobs',
  templateUrl: 'game-jobs.component.html'
})

export class GameJobsComponent implements OnInit, OnDestroy {
  @Input() gameId;
  @Input() gameIid;

  originalJobs = [];
  gameJobDetails = [];
  jobsOverallStatus = 'Game In Progress';
  failLabel = 'Fail';
  completeLabel = 'Complete';
  claimLabel = 'Claim';
  gameJobsExist = false;
  servers;
  server;
  disableSetup = true;
  loggerStaff = [];
  operationStaff = [];
  loggerUsers: UserRef[] = [];
  adminUsers: UserRef[] = [];
  subscription1: Subscription;
  subscription2: Subscription;
  gameJobTypesCount = 10;
  serversFullInfo = [];
  currentServerIp = '';
  currentServer;
  jobTypes;
  JobTypeId = 0;

  constructor(private notificationService: NotificationService,
              private operationsService: OperationsHttpService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.getServers();
    this.loadInitialState();
  }


  ngOnDestroy() {
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }

  // setupJobsMissions() {
  //  if (this.server) {
  //    const createJobsOptions = { withMission: true };
  //    this.createJobs(createJobsOptions);
  //  } else {
  //    this.notificationService.showError('Server not selected', 'Select server before setup jobs and missions!');
  //  }
  // }

  selectOutput(source, row) {
    if (source === 'fail') {
      row.status = 6;
      if (!Job.isLoggingPhase(row.jobType)) {
        this.setCurrentUserAsAssignee(row);
      }
      this.changeJobStatus(row, true);
    } else if (source === 'complete') {
      row.status = 7;
      if (!Job.isLoggingPhase(row.jobType)) {
        this.setCurrentUserAsAssignee(row);
      }
      this.changeJobStatus(row, true);
    } else if (source === 'claim') {
      if (row.output.claim === 'Claim' || row.output.claim === 'Assign') {
        if (Job.isLoggingPhase(row.jobType)) {
          row.status = 3;
        } else {
          row.status = 2;
        }
        row.output.claim = 'Declaim';
      } else {
        row.status = 8;
        if (Job.isLoggingPhase(row.jobType)) {
          row.output.claim = 'Assign';
        } else {
          row.output.claim = 'Claim';
        }
      }
      this.claimAssignee(row, true);
    }
  }

  onCommentTyping(event, row, input, index) {
    if (event.keyCode === 13) {
      if (index === -1) {
        row.comments.push(input.value);
      } else {
        row.comments[index] = input.value;
      }
      input.value = '';
      const job = this.createJobFromParam(row);
      job.comments = row.comments;
      this.operationsService.putJob(job.id, job).subscribe(res => {
        this.loadInitialState();
        // if (this.allCommentsFilledUp(row.comments)) {
        //   // row.comments.push('');
        // }
        this.onSuccessCheckValidation(res, 'Comment saved', 'Your comment has been saved successfully');
      }, error => {
        this.notificationService.showError('Error while saving comment', error);
      });
    }
  }

  onServerSelect(server) {
    const foundedServer = this.serversFullInfo.filter(ser => ser.id === server);
    if (foundedServer && foundedServer[0]) {
      this.currentServer = foundedServer[0];
      this.currentServerIp = foundedServer[0].publicHost;
    }
  }

  assigneeSelected(row, assigneeId) {
    row.assigneeSelected = assigneeId;
    if (Job.isLoggingPhase(row.jobType)) {
      row.output.claim = 'Assign';
    } else {
      row.output.claim = 'Claim';
    }
  }

  getJobStatus(status, type) {
    return Job.getJobStatusNameByStatus(status, type);
  }

  private loadInitialState() {
    const loggersUrl = this.operationsService.getLoggers();
    const adminsUrl = this.operationsService.getAdmins();
    const getJobsByGameUrl = this.operationsService.getJobsByGame(this.gameId);
    this.subscription2 = Observable.forkJoin([adminsUrl, loggersUrl, getJobsByGameUrl])
      .map((res: any) => ({admins: res[0].result, loggers: res[1].result, jobs: res[2]}))
      .mergeMap(entities => {
        const loggers = [];
        loggers.push({label: 'Select Logger', value: '0'});
        for (const entity of entities.loggers) {
          loggers.push({label: entity.first + ' ' + entity.last, value: entity.id});
        }
        const admins = [];
        admins.push({label: 'Select Operational', value: '0'});
        for (const entity of entities.admins) {
          admins.push({label: entity.first + ' ' + entity.last, value: entity.id});
        }
        return Observable.of({loggers: loggers, admins: admins});
      }, (baseResult, nextResult) => ({baseRes: baseResult, nextRes: nextResult}))
      .subscribe((result: any) => {
        if (result.baseRes.jobs.length > 0) {
          this.server = result.baseRes.jobs[0].server.id;
          this.operationStaff = result.nextRes.admins;
          this.adminUsers = result.baseRes.admins;
          this.loggerStaff = result.nextRes.loggers;
          this.loggerUsers = result.baseRes.loggers;
          const getJobs = result.baseRes.jobs;
          const jobsCount = result.baseRes.jobs.length;
          for (let i = 0; i < jobsCount; i++) {
            result.baseRes.jobs[i] = Object.assign({}, { 'isDisable': true }, result.baseRes.jobs[i]);
          }

          // if (result.baseRes.jobs[0].status === 1 && result.baseRes.jobs[1].status === 1) {
          //   result.baseRes.jobs[0].status = 8;
          //   result.baseRes.jobs[1].status = 8;
          //   result.baseRes.jobs[0].isDisable = false;
          //   result.baseRes.jobs[1].isDisable = false;
          //   this.operationsService.putJob(result.baseRes.jobs[0].id, result.baseRes.jobs[0]).subscribe(res => {
          //   }, error => {
          //     this.notificationService.showError('Error during job Complete ', error);
          //     });
          //   this.operationsService.putJob(result.baseRes.jobs[1].id, result.baseRes.jobs[1]).subscribe(res => {
          //   }, error => {
          //     this.notificationService.showError('Error during job Complete', error);
          //   });
          // } else
          if (result.baseRes.jobs[0].status === 6 && (result.baseRes.jobs[1].status === 8 || result.baseRes.jobs[1].status === 2)
            && result.baseRes.jobs[2].status === 1) {
            result.baseRes.jobs[0].isDisable = false;
            result.baseRes.jobs[1].isDisable = false;
          } else if (result.baseRes.jobs[1].status === 6 && (result.baseRes.jobs[0].status === 8 || result.baseRes.jobs[0].status === 2)
            && result.baseRes.jobs[2].status === 1) {
            result.baseRes.jobs[0].isDisable = false;
            result.baseRes.jobs[1].isDisable = false;
          } else if (result.baseRes.jobs[0].status === 6 && result.baseRes.jobs[1].status === 7) {
            result.baseRes.jobs[0].isDisable = false;
          } else if (result.baseRes.jobs[1].status === 6 && result.baseRes.jobs[0].status === 7) {
            result.baseRes.jobs[1].isDisable = false;
          } else if (result.baseRes.jobs[0].status === 6 && result.baseRes.jobs[1].status === 6) {
            result.baseRes.jobs[0].isDisable = false;
            result.baseRes.jobs[1].isDisable = false;
          } else if ((result.baseRes.jobs[0].status === 8 || result.baseRes.jobs[0].status === 2) &&
            (result.baseRes.jobs[1].status === 8 || result.baseRes.jobs[1].status === 2)) {
            result.baseRes.jobs[0].isDisable = false;
            result.baseRes.jobs[1].isDisable = false;
          } else if (result.baseRes.jobs[1].status === 8 || result.baseRes.jobs[1].status === 2) {
            result.baseRes.jobs[1].isDisable = false;
          } else if (result.baseRes.jobs[0].status === 8 || result.baseRes.jobs[0].status === 2) {
            result.baseRes.jobs[0].isDisable = false;
          } else if (result.baseRes.jobs[0].status === 7 && result.baseRes.jobs[1].status === 7
            && result.baseRes.jobs[2].status === 1 || result.baseRes.jobs[2].status === 6
            || (result.baseRes.jobs[2].status === 8 || result.baseRes.jobs[2].status === 2)) {
            if (result.baseRes.jobs[2].status === 6) {
              result.baseRes.jobs[2].isDisable = false;
            } else if (result.baseRes.jobs[0].status === 7 && result.baseRes.jobs[1].status === 7 && result.baseRes.jobs[2].status === 1) {
              // result.baseRes.jobs[2].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[2].id, result.baseRes.jobs[2]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[2].isDisable = false;
            } else {
              result.baseRes.jobs[2].isDisable = false;
            }
          } else if (result.baseRes.jobs[2].status === 7 && result.baseRes.jobs[3].status === 1
            || result.baseRes.jobs[3].status === 6 || (result.baseRes.jobs[3].status === 8 || result.baseRes.jobs[3].status === 2)) {
            if (result.baseRes.jobs[3].status === 6) {
              result.baseRes.jobs[3].isDisable = false;
            } else if (result.baseRes.jobs[2].status === 7 && result.baseRes.jobs[3].status === 1) {
              // result.baseRes.jobs[3].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[3].id, result.baseRes.jobs[3]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[3].isDisable = false;
            } else {
              result.baseRes.jobs[3].isDisable = false;
            }
          } else if (result.baseRes.jobs[3].status === 7 && result.baseRes.jobs[4].status === 1
            || result.baseRes.jobs[4].status === 6 ||
            (result.baseRes.jobs[4].status === 8 || result.baseRes.jobs[4].status === 2 || result.baseRes.jobs[4].status === 3)) {
            if (result.baseRes.jobs[4].status === 6) {
              result.baseRes.jobs[4].isDisable = false;
            } else if (result.baseRes.jobs[3].status === 7 && result.baseRes.jobs[4].status === 1) {
              // result.baseRes.jobs[4].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[4].id, result.baseRes.jobs[4]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[4].isDisable = false;
            } else {
              result.baseRes.jobs[4].isDisable = false;
            }
          } else if (result.baseRes.jobs[4].status === 7 && result.baseRes.jobs[5].status === 1
            || result.baseRes.jobs[5].status === 6 || result.baseRes.jobs[6].status === 6 ||
            (result.baseRes.jobs[6].status === 8 || result.baseRes.jobs[6].status === 2 || result.baseRes.jobs[6].status === 3)) {
            if (result.baseRes.jobs[5].status === 6) {
              result.baseRes.jobs[5].isDisable = false;
              result.baseRes.jobs[6].isDisable = false;
            } else if (result.baseRes.jobs[6].status === 6) {
              result.baseRes.jobs[6].isDisable = false;
            } else if (result.baseRes.jobs[4].status === 7 && result.baseRes.jobs[5].status === 1 && result.baseRes.jobs[6].status === 1) {
              // result.baseRes.jobs[5].status = 8;
              // result.baseRes.jobs[6].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[5].id, result.baseRes.jobs[5]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              // this.operationsService.putJob(result.baseRes.jobs[6].id, result.baseRes.jobs[6]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[5].isDisable = false;
              result.baseRes.jobs[6].isDisable = false;
            } else {
              result.baseRes.jobs[5].isDisable = false;
              result.baseRes.jobs[6].isDisable = false;
            }
          } else if (result.baseRes.jobs[4].status === 7 && result.baseRes.jobs[5].status === 7
            && result.baseRes.jobs[6].status === 7 && result.baseRes.jobs[7].status === 1
            || result.baseRes.jobs[7].status === 6 || (result.baseRes.jobs[7].status === 8 || result.baseRes.jobs[7].status === 2)) {
            if (result.baseRes.jobs[8].status === 6) {
              result.baseRes.jobs[7].isDisable = false;
            } else if (result.baseRes.jobs[6].status === 7 && result.baseRes.jobs[5].status === 7
              && result.baseRes.jobs[4].status === 7 && result.baseRes.jobs[7].status === 1) {
              // result.baseRes.jobs[7].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[7].id, result.baseRes.jobs[7]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[7].isDisable = false;
            } else {
              result.baseRes.jobs[7].isDisable = false;
            }
          } else if ((result.baseRes.jobs[7].status === 7 && result.baseRes.jobs[8].status === 1)
            || result.baseRes.jobs[8].status === 6 || (result.baseRes.jobs[8].status === 8 || result.baseRes.jobs[8].status === 2)) {
            if (result.baseRes.jobs[8].status === 6) {
              result.baseRes.jobs[8].isDisable = false;
            } else if (result.baseRes.jobs[7].status === 7 && result.baseRes.jobs[8].status === 1) {
              // result.baseRes.jobs[8].status = 8;
              // result.baseRes.jobs[7].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[8].id, result.baseRes.jobs[8]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[8].isDisable = false;
            } else {
              result.baseRes.jobs[8].isDisable = false;
            }
          } else if ((result.baseRes.jobs[8].status === 7 && result.baseRes.jobs[9].status === 1)
            || result.baseRes.jobs[9].status === 6 || (result.baseRes.jobs[9].status === 8 || result.baseRes.jobs[9].status === 2)) {
            if (result.baseRes.jobs[9].status === 6) {
              result.baseRes.jobs[9].isDisable = false;
            } else if (result.baseRes.jobs[8].status === 7 || result.baseRes.jobs[9].status === 1) {
              // result.baseRes.jobs[9].status = 8;
              // this.operationsService.putJob(result.baseRes.jobs[9].id, result.baseRes.jobs[9]).subscribe(res => {
              // }, error => {
              //   this.notificationService.showError('Error during job Complete', error);
              // });
              result.baseRes.jobs[9].isDisable = false;
            } else {
              result.baseRes.jobs[9].isDisable = false;
            }
          }
          this.gameJobDetails = [];
          this.originalJobs = [];
          // next line will set gameJobDetails and store original jobs into originalJobs
          this.prepareGameJobDetails(getJobs);
          this.handleOverallGameStatus();
          this.disableSetup = !this.checkExistingJobsForGame(result.baseRes.jobs);
        } else {
          this.disableSetup = false;
        }
      }, error => {
        this.notificationService.showError('Error while loading jobs or loggers', error);
      });
  }

  // private createJobs(options = { withMission: false }) {
  createJobs() {
    if (this.currentServer) {
    const jobsToCreate = [];
    for (let jobType = 1; jobType < this.gameJobTypesCount + 1; jobType++) {
      if (this.gameJobDetails) {
        const existingJob = this.gameJobDetails.filter(j => j.jobType === jobType)[0];
        if (!(existingJob)) {
          const newJob = Job.createJobFromScratch(jobType, this.currentServer.id, this.gameId, this.gameIid);
          jobsToCreate.push(newJob);
        }
      }
    }

    this.operationsService.bulkJobs(jobsToCreate).subscribe(res => {
      // const valid = this.onSuccessCheckValidation(res, 'Added jobs', 'Jobs were created successfully');
      // if (valid && options.withMission) {
      // this.createMission();
      // }
      this.loadInitialState();
    }, error => {
      this.notificationService.showError('Error while creating jobs', error);
      });
    } else {
      this.notificationService.showError('Server not selected', 'Select server before setup jobs and missions!');
    }
  }

  createMission() {
    if (this.server) {
      const mission = new MissionRequest(this.gameIid, this.currentServerIp, this.currentServer.id, this.currentServer.name);
      this.operationsService.postMission(this.gameId, mission).subscribe(result => {
        this.onSuccessCheckValidation(result, 'Mission created', 'Mission was successfully created');
        this.loadInitialState();
        // todo: refactor
        // after mission created, we load gameTracker instance,
        // add this mission and server to this gameTracker
        // and update gameTracker
        // if (valid) {
        //   const missionId = result.result;
        //   this.operationsService.getGameTracker(this.gameId).subscribe(res => {
        //     res.missionId = missionId;
        //     res.encodingServer = {
        //       id: this.currentServer.id,
        //       iid: this.currentServer.iid,
        //       name: this.currentServer.name
        //     };
        //     this.operationsService.putGameTracker(this.gameId, res).subscribe(_ => {
        //       this.notificationService.showSuccess('GT: MissionID saved');
        //     }, err => {
        //       this.notificationService.showError('GT: Cannot save MissionID', err, 3);
        //     });
        //   }, err => {
        //     this.notificationService.showError('Cannot read GT');
        //   });
        // }
      }, error => {
        this.notificationService.showError('Mission was not created', error);
      });
    } else {
      this.notificationService.showError('Server not selected', 'Select server before setup jobs and missions!');
    }
  }

  private getServers() {
    this.subscription1 = this.operationsService.getServers()
      .map((res: any) => res.result)
      .mergeMap((entities: any[]) => {
        const servers = [];
        for (const entity of entities) {
          servers.push({ label: entity.name, value: entity.id });
        }
        return Observable.of(servers);
      }, (serverResult, nextResult) => ({fullResult: serverResult, nextRes: nextResult }))
      .subscribe((res: any) => {
        this.servers = res.nextRes;
        this.serversFullInfo = res.fullResult;
        if (this.servers.length > 0) {
          this.server = this.servers[0];
          this.currentServerIp = res.fullResult[0].publicHost;
          this.currentServer = res.fullResult[0];
        }
      }, error => {
        this.notificationService.showError('Error while loading servers', error);
      });
  }

  private claimAssignee(row, statusChanged = false) {
    const job = this.createJobFromParam(row, statusChanged);
    this.operationsService.putJob(job.id, job).subscribe(res => {
      this.onSuccessCheckValidation(res, 'Job updated', 'The assignee person claimed successfully');
      this.loadInitialState();
    }, error => {
      this.notificationService.showError('Error during claiming assignee', error);
    });
  }

  private changeJobStatus(row, statusChanged = false) {
    const job = this.createJobFromParam(row, statusChanged);
    this.operationsService.putJob(job.id, job).subscribe(res => {
      this.onSuccessCheckValidation(res, 'Status changed', 'Status of the job has been changed');
      this.loadInitialState();

      // row.statusName = Job.getJobStatusNameByStatus(row.status);
      // this.handleOverallGameStatus();
    }, error => {
      this.notificationService.showError('Error during changing status', error);
    });
  }

  private prepareGameJobDetails(jobs) {
    if (jobs) {
      this.originalJobs = jobs;
      for (let i = 1; i < this.gameJobTypesCount + 1; i++) {
        let job = jobs.filter(j => j.jobType === i);
        if (job && job[0]) {
          job = job[0];
          const jobToCreate = {
            server: job.server,
            game: job.game,
            jobArgs: job.jobArgs,
            job: Job.getJobNameByType(i),
            statusName: Job.getJobStatusNameByStatus(job.status, job.jobType),
            created: job.created,
            minStartDate: job.minStartDate,
            jobHandler: job.jobHandler,
            comments: job.comments,
            assignee: this.getStaffDependingOnJobType(i),
            assigneeSelected: this.getStaffSelectedDependingOnJobType(i, job),
            user: job.assignee,
            jobType: job.jobType,
            handlerType: job.handlerType,
            output: {fail: 'Fail', complete: 'Complete', claim: Job.isLoggingPhase(job.jobType) ? 'Assign' : 'Claim'},
            id: job.id,
            iid: job.iid,
            status: job.status,
            isDisable: job.isDisable,
            statusUpdates: job.statusUpdates.map((v) => {
              return {
                newStatus: v.newStatus,
                updated: moment(v.updated, moment.ISO_8601).toDate()
              };
            })
          };
          if (typeof jobToCreate.assigneeSelected === 'string') {
            jobToCreate.output.claim = 'Declaim';
          }
          this.gameJobDetails.push(jobToCreate);
        } else {
          this.disableSetup = false;
        }
      }
    }
  }

  private setCurrentUserAsAssignee(row) {
    const userId = this.authService.currentUser().id;
    if (userId) {
      row.assigneeSelected = userId;
      row.output.claim = 'Declaim';
    }
  }

  private checkExistingJobsForGame(jobs) {
    for (let i = 1; i < this.gameJobTypesCount + 1; i++) {
      const retVal = jobs.filter(j => j.status === i);
      if (!(retVal) || retVal.length === 0) {
        return false;
      }
    }
    return true;
  }

  private getStaffDependingOnJobType(jobType) {
    if (jobType === 5 || jobType === 6 || jobType === 7) {
      return this.loggerStaff.sort(this.sortByLastName);
    } else {
      return this.operationStaff.sort(this.sortByLastName);
    }
  }

  private sortByLastName(user1, user2) {
    if (user1.label === 'Select Operational' || user1.label === 'Select Logger') { return -1; }
    if (user1.label.toLowerCase() < user2.label.toLowerCase()) { return -1; }
    if (user1.label.toLowerCase() > user2.label.toLowerCase()) { return 1; }
    return 0;
  }

  private getStaffSelectedDependingOnJobType(jobType, job) {
    let userId, result;

    if (!!(job.assignee)) {
      userId = job.assignee.id;
    }

    if (jobType === 5 || jobType === 6 || jobType === 7) {
      if (userId) {
        result = this.loggerStaff.filter(log => log.value === userId);
        if (result.length) {
          return result[0].value;
        }
      }
      return this.loggerStaff[0];
    } else {
      if (userId) {
        result = this.operationStaff.filter(adm => adm.value === userId);
        if (result.length) {
          return result[0].value;
        }
      }
      return this.operationStaff[0];
    }
  }

  // private allCommentsFilledUp(comments) {
  //   for (let comm of comments) {
  //     if (comm.trim() === '') {
  //       return false;
  //     }
  //   }
  //   return true;
  // }

  private createJobFromParam(row, statusChanged = false): Job {
    // const job = Job.createJobFromParams(row, statusChanged);
    const job = this.originalJobs.filter(x => x.id === row.id)[0];
    job.status = row.status;
    const currentUser = this.authService.currentUser();
    if (row.output.claim === 'Declaim') {
      if (row.assigneeSelected !== '0') {
        let user;
        if (row.jobType === 5 || row.jobType === 6 || row.jobType === 7) {
          user = this.loggerUsers.filter(log => log.id === row.assigneeSelected);
        } else {
          user = this.adminUsers.filter(log => log.id === row.assigneeSelected);
        }
        if (user && user[0]) {
          job.assignee = <UserRef>{
            id: user[0].id,
            iid: user[0].iid,
            first: user[0].first,
            last: user[0].last,
            username: user[0].username
          };
        } else {
          job.assignee = <UserRef>{
            id: currentUser.id,
            iid: currentUser.iid,
            first: currentUser.first,
            last: currentUser.last,
            username: currentUser.username
          };
        }
      } else {
        job.assignee = <UserRef>{};
      }
    } else {
      job.assignee = <UserRef>{};
      row.assigneeSelected = this.getStaffSelectedDependingOnJobType(row.jobType, row);
    }

    return job;
  }

  private handleOverallGameStatus() {
    for (const job of this.gameJobDetails) {
      if (job.status === JobStatus.Failed) {
        this.jobsOverallStatus = 'Game processing failed';
        return;
      }
    }
    for (const job of this.gameJobDetails) {
      if (job.status !== JobStatus.Completed) {
        this.jobsOverallStatus = 'Game processing in progress';
        return;
      }
    }
    this.jobsOverallStatus = 'Game Ready';
  }

  private onSuccessCheckValidation(res, header, text): boolean {
    if (res && res.errors && res.errors.length > 0) {
      let errorText = '';
      for (const err of res.errors) {
        errorText += err + '</br>';
      }
      this.notificationService.showError('Failed', errorText);
      return false;
    } else {
      this.notificationService.showSuccess(header, text);
      return true;
    }
  }
}
