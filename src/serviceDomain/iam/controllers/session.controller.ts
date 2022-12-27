import SessionModel, { Session } from '@ServiceDomain/basement/models/session.DBmodel'
import { DocumentType } from '@typegoose/typegoose'
import { Error } from 'mongoose'
import { User } from '@ServiceDomain/iam/models/user.DBmodel'
import { YFTError } from '@Base/yft'
import UAParser from 'ua-parser-js'

export interface PreparedSessionObject {
  id: string
  clientIp: string
  userAgent?: string
  browser?: string
  cpu?: string
  os?: string
  engine?: string
  device?: {
    model: string
    type: string
    vendor: string
  }
  latestAccess: Date
  firstAccess: Date
}

export default class SessionController {
  async createSession(user: User, userAgent: UAParser.IResult, clientIp: string | string[]): Promise<DocumentType<Session>> {
    const newSession = await SessionModel.create({
      userId: user._id.toString(),
      clientIp: clientIp,
      userAgent: userAgent.ua,
      browser: userAgent.browser.name && userAgent.browser.version ? `${userAgent.browser.name}/${userAgent.browser.version}` : null,
      cpu: userAgent.cpu.architecture ? userAgent.cpu.architecture : null,
      os: userAgent.os.name && userAgent.os.version ? `${userAgent.os.name}/${userAgent.os.version}` : null,
      engine: userAgent.engine.name && userAgent.engine.version ? `${userAgent.engine.name}/${userAgent.engine.version}` : null,
      device: JSON.stringify(userAgent.device),
      firstAccess: new Date(),
      latestAccess: new Date()
    })

    return newSession
  }

  async getSession(user: User, sessionId: string, bypass = false): Promise<DocumentType<Session>> {
    const findOptions = {
      _id: sessionId,
      userId: user._id.toHexString(),
      isDeleted: false
    }
    if (bypass) {
      delete findOptions.isDeleted
    }
    const session = await SessionModel.findOne(findOptions)
    if (!session) {
      throw YFTError.SessionNotFound
    }
    return session
  }

  async updateLatestAccessSession(user: User, sessionId: string, latestAccess = new Date()): Promise<DocumentType<Session>> {
    try {
      const query = {
        _id: sessionId,
        userId: user._id.toHexString(),
        isDeleted: false
      }
      const update = {
        latestAccess: latestAccess
      }
      const updatedSession = await SessionModel.findOneAndUpdate(query, update, { new: true }).orFail()
      return updatedSession
    } catch (error) {
      if (error instanceof Error.DocumentNotFoundError) {
        throw YFTError.SessionNotFound
      }
      throw YFTError.InternalServerError
    }
  }

  async getAllSessionsByUser(userOrUserId: User | string, bypass = false): Promise<PreparedSessionObject[]> {
    try {
      const findOptions = {
        userId: typeof userOrUserId === 'string' ? userOrUserId : userOrUserId._id.toString(),
        isDeleted: false
      }
      if (bypass) {
        delete findOptions.isDeleted
      }
      const sessions = await SessionModel.find(findOptions)
      return sessions.map(session => this.prepareSessionInstanceForClient(session))
    } catch (error) {
      throw YFTError.InternalServerError
    }
  }

  async terminateSession(sessionId: string, user: User): Promise<PreparedSessionObject[]> {
    try {
      const query = {
        _id: sessionId,
        userId: user._id.toHexString(),
        isDeleted: false
      }
      const update = {
        isDeleted: true
      }
      await SessionModel.findOneAndUpdate(query, update, { new: true }).orFail()
      return await this.getAllSessionsByUser(user)
    } catch (error) {
      if (error instanceof Error.DocumentNotFoundError) {
        throw YFTError.SessionNotFound
      }
      throw YFTError.InternalServerError
    }
  }

  prepareSessionInstanceForClient(session: Session): PreparedSessionObject {
    return {
      id: session._id.toString(),
      userAgent: session.userAgent,
      clientIp: session.clientIp,
      browser: session.browser,
      firstAccess: session.firstAccess,
      latestAccess: session.latestAccess,
      cpu: session.cpu,
      device: JSON.parse(session.device),
      engine: session.engine,
      os: session.os
    }
  }
}
