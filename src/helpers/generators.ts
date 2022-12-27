import Crypto from 'crypto'

function generateRandomString(length: number): string {
  return Crypto.randomBytes(length / 2).toString('hex')
}

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default {
  generateRandomString,
  generateRandomNumber
}