import winston, { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
const { logstash, combine, timestamp } = format;

export type ServiceStatus = "created" | "started" | "stopped";

export default class LoggerController {
  private logger?: winston.Logger;
  private static instance: LoggerController;
  private constructor() {
    /** */
  }

  public static shared(): LoggerController {
    if (!this.instance) {
      this.instance = new LoggerController();

      const transporter = new DailyRotateFile({
        filename: `${process.env.LOG_FILE_LOCATION}/${process.env.APPLICATION_NAME}-logs-%DATE%.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        zippedArchive: true,
      });

      this.instance.logger = createLogger({
        format: combine(timestamp(), logstash()),
        defaultMeta: {
          application: `${process.env.APPLICATION_NAME}`,
          tag: process.env.LOG_META_DATA_TAG,
        },
        transports: [
          // new transports.Console(),
          transporter,
        ],
        handleExceptions: true,
      });
    }
    return this.instance;
  }

  public recordServiceStatusChangedLog(
    serviceName: string,
    status: ServiceStatus
  ): void {
    this.logger?.info({
      level: "info",
      service: serviceName,
      event: `service-${status}`,
      message: "Service Status Changed",
    });
  }

  public recordGeneralExceptionLog(
    serviceName: string,
    className: string,
    functionName: string,
    error: string,
    stack?: string,
    additionalInfo?: Record<string, string | number | symbol>
  ): void {
    this.logger?.error({
      level: "error",
      service: serviceName,
      class: className,
      function: functionName,
      event: "exception in application",
      message: error || "unknown error",
      error: error,
      stack: stack,
      additionalInfo: additionalInfo,
    });
  }

  public recordThirdpartyApiCallFailedLog(
    serviceName: string,
    thirdpartyName: string,
    apiName: string,
    url: string,
    error: string,
    stack?: string,
    additionalInfo?: Record<string, string | number | symbol>
  ): void {
    this.logger.error({
      level: "error",
      service: serviceName,
      event: "thirdparty-api-failed",
      message: error || "unknown error",
      thirdpartyName: thirdpartyName,
      apiName: apiName,
      url: url,
      error: error,
      stack: stack,
      additionalInfo: additionalInfo,
    });
  }

  public recordThirdPartyApiCallSucceededLog(
    serviceName: string,
    thirdpartyName: string,
    apiName: string,
    url: string,
    additionalInfo: Record<string, string | number | symbol>
  ): void {
    this.logger.info({
      level: "info",
      service: serviceName,
      event: "thirdparty-api-succeeded",
      message: "Thirdparty API Succeeded",
      thirdpartyName: thirdpartyName,
      apiName: apiName,
      url: url,
      additionalInfo: additionalInfo,
    });
  }

  public recordGeneralLog(
    serviceName: string,
    className: string,
    functionName: string,
    eventName = "general log",
    additionalInfo?: Record<
      string,
      string | number | symbol | Record<string, string>
    >
  ): void {
    this.logger?.info({
      message: eventName,
      level: "info",
      service: serviceName,
      class: className,
      function: functionName,
      event: eventName,
      additionalInfo: additionalInfo,
    });
  }
}
