import { HttpResponse, HttpRequest } from '../protocols/http'
import { badRequest } from '../helper/http-helper'
import { MissingParamError } from '../error/missing-param-error'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../error/invalid-param-error'
import { ServerError } from '../error/server-error'
export class SignUpController implements Controller{
  private readonly emailValidator: EmailValidator
  constructor(emailValidator: EmailValidator){
    this.emailValidator = emailValidator
  }
  handle(httpRequest: HttpRequest): HttpResponse{
    try{
      const requiredFields = ['name','email', 'password', 'passowrdConfirmation']
      for (const field of requiredFields){
        if (!httpRequest.body[field]){
          return badRequest( new MissingParamError(field) )
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if(!isValid){
        return badRequest( new InvalidParamError('email') )
      }
    } catch (error){
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}