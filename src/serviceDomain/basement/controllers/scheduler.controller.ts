import Queue from "bull";
import IORedis from "ioredis";
import { Context, ServiceBroker } from "moleculer";
import LoggerController from "./logger.controller";

export default class SchedulerController {
  private redisConfig: IORedis.RedisOptions;
  private broker: ServiceBroker;

  constructor(broker: ServiceBroker, serviceName: string) {
    const redisPort = Number(process.env.REDIS_PORT) || 6379;
    const redisHost = process.env.REDIS_HOST || "localhost";
    const redisPassword = process.env.REDIS_PASSWORD || "";
    this.redisConfig = {
      port: redisPort,
      host: redisHost,
      password: redisPassword,
    };
    this.broker = broker;
  }

  public async scheduleAndStartJobs(): Promise<void> {
    this.createQueueToCheckTransactionStatusEvery30Seconds();
  }

  private createQueueToCheckTransactionStatusEvery30Seconds() {
    const queue = new Queue("Check Transaction Status Every 30 Seconds", {
      redis: this.redisConfig,
    });
    queue.process(async () => {
      LoggerController.shared().recordGeneralLog(
        "",
        "SchedulerController",
        "createQueueToCheckWSConnectionEvery30Seconds",
        "job.run"
      );
      try {
        // await TransactionController.shared().checkTransactions(this.broker)
      } catch (error) {
        if (error instanceof Error) {
          LoggerController.shared().recordGeneralExceptionLog(
            "",
            "SchedulerController",
            "createQueueToCheckWSConnectionEvery30Seconds",
            error.message
          );
        } else {
          LoggerController.shared().recordGeneralExceptionLog(
            "",
            "SchedulerController",
            "createQueueToCheckWSConnectionEvery30Seconds",
            "unknown error"
          );
        }
      }
    });
    const sixtyMinutesInMilliseconds = 30_000;
    queue.add(null, { repeat: { every: sixtyMinutesInMilliseconds } });
    queue.on("completed", (job) => {
      //
    });
  }
}
