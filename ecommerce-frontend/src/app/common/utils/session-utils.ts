export class SessionUtils {
  static getSessionNumberOrDefault(sessionPropertyName: string, defaultNumber: number): number {
    const sessionvalue = sessionStorage.getItem(sessionPropertyName)
    return sessionvalue !== null ? +JSON.parse(sessionvalue) : defaultNumber
  }
}
