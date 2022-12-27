import console from 'console'
import crypto, { Encoding } from 'crypto'
import LoggerController from '@ServiceDomain/basement/controllers/logger.controller'

export default class Encryptor {
  private static instance: Encryptor

  public static shared(): Encryptor {
    if (!Encryptor.instance) {
      Encryptor.instance = new Encryptor()
    }
    return Encryptor.instance
  }

  public async encryptData(plain: string): Promise<string> {
    try {
      const algorithm = process.env.WALLET_ENCRYPTION_ALGORITHM
      const inputEncoding = <Encoding>process.env.WALLET_ENCRYPTION_PLAINTEXT_ENCODING
      const outputEncoding: 'hex' | 'utf8' = 'hex'

      const key = Buffer.from(process.env.WALLET_ENCRYPTION_SHARED_KEY, <BufferEncoding>process.env.WALLET_ENCRYPTION_BUFFER_ENCODING) // key must be 32 bytes for aes256
      const iv = crypto.randomBytes(Number(process.env.WALLET_ENCRYPTION_IV_LENGTH))

      const cipher = crypto.createCipheriv(algorithm, key, iv)
      let ciphered = cipher.update(plain, inputEncoding, outputEncoding)
      ciphered += cipher.final(outputEncoding)
      const cipherText = iv.toString(outputEncoding) + ':' + ciphered
      return cipherText
    } catch(error) {
      LoggerController.shared().recordGeneralExceptionLog('', 'Encryptor', 'encryptDatas', error)
    }
  }
 
  public async decryptData(cipherText: string): Promise<string> {
    try {
      const algorithm = process.env.WALLET_ENCRYPTION_ALGORITHM
      const cipherTextEncoding = <Encoding>process.env.WALLET_ENCRYPTION_CIPHER_TEXT_ENCODING
      const outputEncoding: 'hex' | 'utf8' = 'utf8'

      const key = Buffer.from(process.env.WALLET_ENCRYPTION_SHARED_KEY, <BufferEncoding>process.env.WALLET_ENCRYPTION_BUFFER_ENCODING) // key must be 32 bytes for aes256
      const ivFromCipherText = Buffer.from(cipherText.split(':')[0], cipherTextEncoding)
      const decipher = crypto.createDecipheriv(algorithm, key, ivFromCipherText)
      let deciphered = decipher.update(cipherText.split(':')[1], cipherTextEncoding, outputEncoding)
      deciphered += decipher.final(outputEncoding)
      return deciphered
    } catch (error) {
      LoggerController.shared().recordGeneralExceptionLog('', 'Encryptor', 'encryptDatas', error)
    }
  }

  public async dynamicEncryptData(plain: string, dynamicKey:string): Promise<string> {
    try {
      const dynamic = dynamicKey+'12345678'
      const baseEncrypted = await this.encryptData(plain)
      const algorithm = process.env.WALLET_ENCRYPTION_ALGORITHM
      const inputEncoding = <Encoding>process.env.WALLET_ENCRYPTION_PLAINTEXT_ENCODING
      const outputEncoding: 'hex' | 'utf8' = 'hex'

      const key = Buffer.from(dynamic, <BufferEncoding>process.env.WALLET_ENCRYPTION_BUFFER_ENCODING) // key must be 32 bytes for aes256
      const iv = crypto.randomBytes(Number(process.env.WALLET_ENCRYPTION_IV_LENGTH))
      const cipher = crypto.createCipheriv(algorithm, key, iv)
      let ciphered = cipher.update(baseEncrypted, inputEncoding, outputEncoding)
      ciphered += cipher.final(outputEncoding)
      const cipherText = iv.toString(outputEncoding) + ':' + ciphered

      return cipherText
    } catch(error) {
      LoggerController.shared().recordGeneralExceptionLog('', 'Encryptor', 'encryptDatas', error)
    }
  }
 
  public async dynamicDecryptData(cipherText: string, dynamicKey:string): Promise<string> {
    try {
      const dynamic = dynamicKey+'12345678'
      const algorithm = process.env.WALLET_ENCRYPTION_ALGORITHM
      const cipherTextEncoding = <Encoding>process.env.WALLET_ENCRYPTION_CIPHER_TEXT_ENCODING
      const outputEncoding: 'hex' | 'utf8' = 'utf8'

      const key = Buffer.from(dynamic, <BufferEncoding>process.env.WALLET_ENCRYPTION_BUFFER_ENCODING) // key must be 32 bytes for aes256
      const ivFromCipherText = Buffer.from(cipherText.split(':')[0], cipherTextEncoding)
      const decipher = crypto.createDecipheriv(algorithm, key, ivFromCipherText)
      let deciphered = decipher.update(cipherText.split(':')[1], cipherTextEncoding, outputEncoding)
      deciphered += decipher.final(outputEncoding)
      return await this.decryptData(deciphered)
    } catch (error) {
      LoggerController.shared().recordGeneralExceptionLog('', 'Encryptor', 'encryptDatas', error)
    }
  }
}
