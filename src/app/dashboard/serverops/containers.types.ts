import { DocumentRef } from '../../shared/entities/document-ref.entity';

export class Container {
  id: string;
  name: string;
  enabled: boolean;
  active: boolean;
  parent: DocumentRef;
  $type: string;
}

export class DataCenter extends Container {
  subnets: string[];
}

export class JobHandler extends Container {
  jobType: JobHandlerType;

  /// <summary>
  /// Get or set job handler status.
  /// </summary>
  status: JobHandlerStatus;
}

export class StbDevice extends Container {
  type: StbDeviceType;
  deviceHost: string;
  encoderHost: string;
  avermediaName: string;
}

export class ServerAsset extends Container {
  domain: string;
  ip: string;
  ipInternal: string;
  pinged: Date;
  odsId: string;
  odsVersion: string;
  machinePool: string;
}

export class INode extends Container {
  host: string;
}

export class ITv extends Container {

}

export class IDvd extends Container {

}

export class IVe extends Container {
  apiUrl: string;
  ftpHost: string;
}

export class Server extends Container {
  publicHost: string;
  privateHost: string;
}

export enum JobHandlerType {
  unknown = 0,
    /// <summary>
    /// Handler to encode DVD game.
    /// </summary>
  dvdEncoding,
    /// <summary>
    /// Handler to encode TV game.
    /// </summary>
  tvEncoding
}

export enum StbDeviceType {
  Unknown = 0,
  DirecTv,
  Roku,
  Dish
}

export enum JobHandlerStatus {
  unknown = 0,
  new,
  initialized,
  stopped,
  canceled,
  running,
  stopping,
  cancelling,
  disabled,
  terminated,
}

export enum ContainerType {
  Unknown = 0,
  DataCenter,
  Server,
  StbDevice,
  HyperNode,
  TV,
  DVD,
  VE,
  JobHandler,
  ServerAsset
}
