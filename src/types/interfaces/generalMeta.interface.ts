/* eslint-disable @typescript-eslint/no-namespace */
import { User } from "@ServiceDomain/iam/models/user.DBmodel";
import UAParser from "ua-parser-js";
import { IncomingMessage } from "http";
namespace generalMetaRequests {
  export interface ClientMetaData {
    userAgent: UAParser.IResult;
    clientIp: string | string[];
  }
  export interface RequestMetaData {
    user: User;
    $statusCode?: number;
    clientIp?: string | string[];
    userAgent?: UAParser.IResult;
    $location?: string;
    $multipart: any;
    request: IncomingMessage;
    validationSchema?: any;
  }
}
export default generalMetaRequests;
