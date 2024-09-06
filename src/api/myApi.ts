/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_login_auth_post */
export interface BodyLoginAuthPost {
  /** Grant Type */
  grant_type?: string | null
  /** Username */
  username: string
  /** Password */
  password: string
  /**
   * Scope
   * @default ""
   */
  scope?: string
  /** Client Id */
  client_id?: string | null
  /** Client Secret */
  client_secret?: string | null
}

/** EventDirection */
export enum EventDirection {
  Incoming = "incoming",
  Outgoing = "outgoing",
}

/** EventInternalCode */
export enum EventInternalCode {
  Registration = "registration",
  DeclarationSending = "declaration_sending",
  NotificationSending = "notification_sending",
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[]
}

/** RegistrationStatus */
export enum RegistrationStatus {
  NotStarted = "not_started",
  CertificateAdded = "certificate_added",
  InProgress = "in_progress",
  Failed = "failed",
  Completed = "completed",
}

/** ReportsEvent */
export interface ReportsEvent {
  /**
   * Id
   * Идентификатор события
   * @format uuid
   */
  id: string
  /**
   * User Id
   * Идентификатор пользователя, к которому относится событие
   */
  user_id?: string | null
  /**
   * Parent Id
   * Идентификатор родительского события
   */
  parent_id?: string | null
  /** Источник/направление события */
  direction: EventDirection
  /**
   * Code
   * Код события из системы отчетности
   */
  code: string
  /** Внутренний код события */
  internal_code?: EventInternalCode | null
  /**
   * Created At
   * Дата и время события
   * @format date-time
   */
  created_at: string
}

/** ReportsUser */
export interface ReportsUser {
  /**
   * Certificate
   * Публичный сертификат пользователя
   */
  certificate?: string | null
  /** Статус пользователя по регистрации в системе отчетности. Возможные значения: 1. not_started - регистрация не начата. 2. certificate_added - регистрация начата, добавлен сертификат. 3. in_progress - запрос на регистрацию отправлен, идет проверка. 4. failed - запрос на регистрацию завершился ошибкой. 4. completed - запрос на регистрацию завершился успешно. */
  registration_status: RegistrationStatus
  /**
   * Status Reason
   * Статус код из системы отчетности
   */
  status_reason?: string | null
}

/** ReportsUserRegistration */
export interface ReportsUserRegistration {
  /**
   * Email
   * Электронная почта пользователя
   */
  email: string
}

/** Token */
export interface Token {
  /** Access Token */
  access_token: string
  /** Token Type */
  token_type: string
}

/** UserCertificate */
export interface UserCertificate {
  /**
   * Certificate
   * Публичный сертификат пользователя
   */
  certificate: string
}

/** UserRegistrationEvents */
export interface UserRegistrationEvents {
  /**
   * Events
   * Список событий по регистрации клиента в системе отчетности. Отсортирован по дате событий
   */
  events: ReportsEvent[]
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[]
  /** Message */
  msg: string
  /** Error Type */
  type: string
}

export type QueryParamsType = Record<string | number, any>
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat
  /** request body */
  body?: unknown
  /** base url */
  baseUrl?: string
  /** request cancellation token */
  cancelToken?: CancelToken
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void
  customFetch?: typeof fetch
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D
  error: E
}

type CancelToken = Symbol | string | number

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/fns_reports"
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"]
  private abortControllers = new Map<CancelToken, AbortController>()
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams)

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  }

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig)
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key)
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key])
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key]
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&")
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {}
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key]
    )
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join("&")
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery)
    return queryString ? `?${queryString}` : ""
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key]
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`
        )
        return formData
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  }

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken)
      if (abortController) {
        return abortController.signal
      }
      return void 0
    }

    const abortController = new AbortController()
    this.abortControllers.set(cancelToken, abortController)
    return abortController.signal
  }

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken)

    if (abortController) {
      abortController.abort()
      this.abortControllers.delete(cancelToken)
    }
  }

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const queryString = query && this.toQueryString(query)
    const payloadFormatter = this.contentFormatters[type || ContentType.Json]
    const responseFormat = format || requestParams.format

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>
      r.data = null as unknown as T
      r.error = null as unknown as E

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data
              } else {
                r.error = data
              }
              return r
            })
            .catch((e) => {
              r.error = e
              return r
            })

      if (cancelToken) {
        this.abortControllers.delete(cancelToken)
      }

      if (!response.ok) throw data
      return data
    })
  }
}

/**
 * @title AKB
 * @version 0.1.28
 * @baseUrl /fns_reports
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Authentication
     * @name LoginAuthPost
     * @summary Login
     * @request POST:/auth
     */
    loginAuthPost: (data: BodyLoginAuthPost, params: RequestParams = {}) =>
      this.request<Token, HTTPValidationError | void>({
        path: `/auth`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Authentication
     * @name RefreshTokenAuthRefreshPost
     * @summary Refresh Token
     * @request POST:/auth/refresh
     * @secure
     */
    refreshTokenAuthRefreshPost: (params: RequestParams = {}) =>
      this.request<Token, void>({
        path: `/auth/refresh`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),
  }
  users = {
    /**
     * @description Данный метод возвращает информацию по пользователю, зарегистрированному в системе отчетности
     *
     * @tags Users
     * @name UserAstralInfoUsersGet
     * @summary Получить информацию по пользователю в системе отчетности
     * @request GET:/users
     * @secure
     */
    userAstralInfoUsersGet: (params: RequestParams = {}) =>
      this.request<ReportsUser, void>({
        path: `/users`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует регистрацию пользователя в системе отчетности
     *
     * @tags Users
     * @name UserToAstralUpdateUsersRegistrationPut
     * @summary Обновить данные по ранее зарегистрированному пользователю в системе отчетности
     * @request PUT:/users/registration
     * @secure
     */
    userToAstralUpdateUsersRegistrationPut: (
      data: ReportsUserRegistration,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/users/registration`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует регистрацию пользователя в системе отчетности. Перед регистрацией обязательна загрузка файла сертификата.
     *
     * @tags Users
     * @name UserToAstralUsersRegistrationPost
     * @summary Зарегистрировать пользователя в системе отчетности
     * @request POST:/users/registration
     * @secure
     */
    userToAstralUsersRegistrationPost: (
      data: ReportsUserRegistration,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/users/registration`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод возвращает цепочку статусов по регистрации и обновлению пользовательских данных в системе отчетности.
     *
     * @tags Users
     * @name UserRegistrationStatusesUsersRegistrationStatusesGet
     * @summary Получить цепочку статусов регистрации пользователя в системе отчетности
     * @request GET:/users/registration/statuses
     * @secure
     */
    userRegistrationStatusesUsersRegistrationStatusesGet: (
      params: RequestParams = {}
    ) =>
      this.request<UserRegistrationEvents, void>({
        path: `/users/registration/statuses`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует загрузку обновление сертификата пользователя в системе отчетности
     *
     * @tags Users
     * @name UserCertificateUpdateUsersRegistrationCertificatePut
     * @summary Обновить публичный сертификат пользователя в систему отчетности
     * @request PUT:/users/registration/certificate
     * @secure
     */
    userCertificateUpdateUsersRegistrationCertificatePut: (
      data: UserCertificate,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/users/registration/certificate`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Данный метод реализует загрузку сертификата пользователя для регистрации пользователя в системе отчетности
     *
     * @tags Users
     * @name UserCertificateUsersRegistrationCertificatePost
     * @summary Загрузить публичный сертификат пользователя в систему отчетности
     * @request POST:/users/registration/certificate
     * @secure
     */
    userCertificateUsersRegistrationCertificatePost: (
      data: UserCertificate,
      params: RequestParams = {}
    ) =>
      this.request<any, HTTPValidationError | void>({
        path: `/users/registration/certificate`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  }
}

export const api = new Api({ baseUrl: "https://api-dev.buh.app/fns_reports" })
