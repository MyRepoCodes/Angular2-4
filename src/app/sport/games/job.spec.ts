import { Job, JobStatus } from './job.entity';

describe('Job', () => {

  it('Get Job status', () => {
    const status = Job.getJobStatusNameByStatus(JobStatus.Unknown);
    expect('Unknown').toEqual(status);
  });

});
