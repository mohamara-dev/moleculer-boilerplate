//@ts-ignore
require('dotenv').config({ path: '.env' })
import dbModels from './src/models'
import mongoDb from './src/models/db/connectors/mongo.db'

import { BrokerOptions, Errors, MetricRegistry, ServiceBroker, LogLevels, Context } from 'moleculer'

(async () => {
  await Promise.resolve(mongoDb())
  for (let i = 0; i < dbModels.length; i++) {
    const model = dbModels[i]
    await model.initialization()
    // await model.migrations()
  }

  const brokerConfig: BrokerOptions = {
    // namespace: 'pos-backend',
    // nodeID: 'posMain',
    metadata: {},
    logger: {
      type: 'Console',
      options: {
        colors: true,
        moduleColors: false,
        formatter: 'full',
        objectPrinter: null,
        autoPadding: false
      }
    },
    logLevel: <LogLevels>process.env.LOG_LEVEL || 'info',
    transporter: "NATS",
    cacher: "Memory",
    serializer: "CBOR",

    // requestTimeout: 5 * 1000,
    dependencyInterval: 5000,

    retryPolicy: {
      enabled: true,
      retries: 5,
      delay: 100,
      maxDelay: 1000,
      factor: 2,
      check: (err: any): boolean => err && !!err.retryable
      // check: (err: Errors.MoleculerError): boolean => err && !!err.retryable

    },
    hotReload: true,

    maxCallLevel: 100,
    heartbeatInterval: 10,
    heartbeatTimeout: 30,

    contextParamsCloning: false,

       tracking: {
        enabled: false,
        shutdownTimeout: 10 * 1000
    },

    disableBalancer: false,

    registry: {
      strategy: 'RoundRobin',
      preferLocal: true
    },

    circuitBreaker: {
      enabled: false,
      threshold: 0.5,
      minRequestCount: 20,
      windowTime: 60,
      halfOpenTime: 10 * 1000,
      check: (err: any): boolean => err && err.code >= 500
    },

    bulkhead: {
      enabled: true,
      concurrency: 10,
      maxQueueSize: 100
    },

    validator: true,

    errorHandler: undefined,

    metrics: {
      enabled: false,
      reporter: {
        type: 'Prometheus',
        options: {
          port: process.env.PROMETHEUS_METRIC_EXPORTER_PORT,
          path: '/metrics',
          defaultLabels: (registry: MetricRegistry): Record<string, string> => ({
            namespace: registry.broker.namespace,
            nodeID: registry.broker.nodeID
          })
        }
      }
    },

    tracing: {
      enabled: false,
      exporter: {
        type: 'Jaeger',
        options: {
          endpoint: null,
          host: process.env.JAEGER_HOST,
          port: process.env.JAEGER_PORT,
          sampler: {
            type: 'Const',
            options: {}
          },
          tracerOptions: {},
          defaultTags: null
        }
      },
      tags: {
        action: {
          params: false,
          meta: false, // ["loggedIn.username"],
          response: false
        }
      }
    },

    middlewares: [],

    replCommands: undefined,

    created: (broker: ServiceBroker): void => console.log('Created ', broker.nodeID)
    // started: async (broker: ServiceBroker): Promise<void> => {},
    // stopped: async (broker: ServiceBroker): Promise<void> => {},
  }
  return brokerConfig
})()
