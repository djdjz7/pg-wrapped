import axios, { AxiosInstance } from 'axios'
import CookieParser from 'set-cookie-parser'

export interface RequestClient extends AxiosInstance {
  cookie: string
}

export function createClient() {
  const client = axios.create({
    maxRedirects: 0,
    validateStatus: (status) => status >= 200 && status < 303,
    withCredentials: true,
    baseURL: 'https://programming.pku.edu.cn',
  }) as RequestClient

  client.interceptors.response.use((response) => {
    const setCookieStr = response.headers['set-cookie']
    client.cookie +=
      '; ' +
      (setCookieStr
        ?.flatMap((str) => {
          return CookieParser.parse(str)
        })
        .map((c) => {
          return `${c.name}=${c.value}`
        })
        .join('; ') ?? '')
    return response
  })

  client.interceptors.request.use((config) => {
    config.headers.set('Cookie', client.cookie)
    return config
  })

  return client
}
