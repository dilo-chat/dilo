import * as React from 'react';
import { NotificationsServiceApiImpl, NotificationsServiceApi } from '../api/notifications';

interface NotificationsContextInterface {
  notificationsAllowed?: boolean;
}

const NotificationsContext = React.createContext<NotificationsContextInterface>({
  notificationsAllowed: false,
});

const NotificationsProvider: React.FC = ({ children }) => {
  const [notificationsApi, setNotificationsApi] = React.useState<NotificationsServiceApi>();

  React.useEffect(() => {
    if (!notificationsApi) {
      setNotificationsApi(new NotificationsServiceApiImpl());
      return
    }

    notificationsApi.init().catch(e => console.log(e))
  }, [notificationsApi]);

  const value: NotificationsContextInterface = {
    notificationsAllowed: !!notificationsApi?.getToken()
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export { NotificationsContext, NotificationsProvider };
