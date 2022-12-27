import { IncomingMessage, ServerResponse } from "http";
import { Service, ServiceBroker, Context } from "moleculer";
import ApiGateway from "moleculer-web";
import UAParser from "ua-parser-js";
const { MoleculerError } = require("moleculer").Errors

import AuthController from "@ServiceDomain/iam/controllers/auth.controller"
import { YFTError, AdminsPrivileges } from "@Base/yft";
import UserController from "@ServiceDomain/iam/controllers/user.controller"
import SessionController from "@ServiceDomain/iam/controllers/session.controller"
import { User } from "@ServiceDomain/iam/models/user.DBmodel";

class CustomIncomingMessage extends IncomingMessage {
  public $action: Record<string, unknown>;
}

export default class ApiService extends Service {
  public constructor(broker: ServiceBroker) {
    super(broker);
    this.parseServiceSchema({
      name: "api",
      version: 1,
      mixins: [ApiGateway],
      settings: {
        port: process.env.SERVER_PORT || 3001,
        cors: {
          origin: "*",
          methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
          allowedHeaders: ["Content-Type", "Authorization"],
          exposedHeaders: ["Location"],
          credentials: false,
          maxAge: 3600,
        },
        routes: [
          {
            path: "/api",
            whitelist: ["**"],
            use: [],
            mergeParams: true,
            authentication: true,
            authorization: true,
            autoAliases: true,

            aliases: {
              // File upload from HTML multipart form
              "POST /": "multipart:assets.upload",

              // File upload from AJAX or cURL
              "PUT /": "stream:assets.upload",

              // File upload from HTML form and overwrite busboy config
              "POST /multi": {
                type: "multipart",
                // Action level busboy config
                busboyConfig: {
                  limits: {
                    files: 3,
                  },
                },
                action: "assets.upload",
              },
            },
            callingOptions: {},

            bodyParsers: {
              json: {
                strict: false,
                limit: "1MB",
              },
              autoClean: true,
              urlencoded: {
                extended: true,
                limit: "1MB",
              },
            },

            mappingPolicy: "strict",
            logging: true,

            onBeforeCall(
              ctx: Context<
                never,
                {
                  request: IncomingMessage;
                  clientIp: string | string[];
                  userAgent: UAParser.IResult;
                }
              >,
              route: never,
              req: IncomingMessage,
              res: ServerResponse
            ) {
              // ctx.meta.request = req;
              if (req.method === "OPTIONS") {
                res.writeHead(200);
                res.end();
                return;
              }
              ctx.meta.clientIp =
                req.headers["x-forwarded-for"] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress; // || req.connection.socket.remoteAddress
              ctx.meta.userAgent = UAParser(req.headers["user-agent"]);
            },
          },
        ],
        log4XXResponses: false,
        logRequestParams: null,
        logResponseData: null,
        assets: {
          folder: "public",
          options: {},
        },

        onError(req: IncomingMessage, res: ServerResponse, err: any) {
          if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Request-Method", "*");
            res.setHeader(
              "Access-Control-Allow-Methods",
              "OPTIONS, GET, POST, PATCH, PUT, DELETE"
            );
            res.setHeader("Access-Control-Allow-Headers", "*");
            res.writeHead(200);
            res.end();
            return;
          }

          if (err instanceof MoleculerError) {
            res
              .writeHead(err.code, { "Content-Type": "application/json" })
              .write(err.message)
          } else {
            res
              .writeHead(500, { "Content-Type": "application/json" })
              .write(YFTError.UnknownInternalServerError);
          }
          res.end();
        },
      },

      methods: {
        async authenticate(
          ctx: Context,
          route: Record<string, undefined>,
          req: CustomIncomingMessage
        ): Promise<User | null> {
          const auth = req.headers.authorization;
          if (auth && auth.startsWith("Bearer")) {
            const accessToken = auth.slice(7);
            const authController = new AuthController();
            try {
              const tokenValidationResult = await authController.decryptToken(
                accessToken
              );
              if (tokenValidationResult.type === "refresh") {
                throw YFTError.AuthenticationInvalidTokenType;
              }
              const userController = UserController.shared();
              const userId = tokenValidationResult.userId;
              const user: User = await userController.getOneById(null, userId);
              if (user.isBanned) {
                throw YFTError.UserAccessDeniedByAdmin;
              }
              const sessionId = tokenValidationResult.sessionId;
              try {
                if (sessionId) {
                  const userId = tokenValidationResult.userId;
                  const user: User = await userController.getOneById(null, userId);
                  await new SessionController().updateLatestAccessSession(
                    user,
                    sessionId
                  );
                  return user;
                } else {
                  throw YFTError.AccessDenied;
                }
              } catch (error) {
                throw YFTError.AccessDenied;
              }
            } catch (error) {
              if (req.$action.auth) {
                throw error;
              }
              return null;
            }
          } else {
            return null;
          }
        },

        async authorize(
          ctx: Context<unknown, { user: User | any }>,
          route: Record<string, undefined>,
          req: CustomIncomingMessage
        ): Promise<void> {
          const user = ctx.meta.user;
          if (req.$action.auth && !user) {
            throw YFTError.AccessDenied;
          }
          if (user as User) {
            if (
              Array.isArray(req.$action.privilegesNeeded) &&
              !user.privileges.includes(AdminsPrivileges.SuperAdmin) &&
              !req.$action.privilegesNeeded.some((privileges) =>
                user.privileges.includes(privileges)
              )
            ) {
              throw YFTError.TokenIsValidButAccessToThisEndpointIsDenied;
            }
          }
        },
      },

      created() {
        // // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'created'})
      },

      async started() {
        // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'started'})
      },

      async stopped() {
        // broker.call('v1.logger.serviceStatusChanged', {serviceName: this.name, status: 'stopped'})
      },
    });
  }
}
