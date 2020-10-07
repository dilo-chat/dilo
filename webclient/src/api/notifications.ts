import { messaging } from '../services/firebase'

export interface NotificationsServiceApi {
  init(): Promise<void>;
  getToken(): string | undefined;
}

export class NotificationsServiceApiImpl implements NotificationsServiceApi {
  private token?: string;

  async init() {
    this.token = await messaging.getToken()
    console.log(this.token)
    messaging.onMessage((payload:any) => {
      console.log('received on api', payload)
    })
  }

  getToken() {
    return this.token;
  }
}
