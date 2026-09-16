import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('besoia_user') || 'null'));
  const [friends, setFriends] = useState(() => JSON.parse(localStorage.getItem('besoia_friends') || '[]'));

  useEffect(() => {
    if (user) localStorage.setItem('besoia_user', JSON.stringify(user));
    else localStorage.removeItem('besoia_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('besoia_friends', JSON.stringify(friends));
  }, [friends]);

  const addFriend = useCallback((friend) => {
    if (!friend?.id) return;
    setFriends((current) => [friend, ...current.filter((item) => item.id !== friend.id)]);
  }, []);

  return <UserContext.Provider value={{ user, setUser, friends, addFriend, clearUser: () => setUser(null) }}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
