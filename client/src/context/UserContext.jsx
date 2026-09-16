import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('besoia_user') || 'null'));

  useEffect(() => {
    if (user) localStorage.setItem('besoia_user', JSON.stringify(user));
    else localStorage.removeItem('besoia_user');
  }, [user]);

  return <UserContext.Provider value={{ user, setUser, clearUser: () => setUser(null) }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
