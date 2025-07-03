import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 🔐 Вход и регистрация ---
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    await handleUserRecord(result.user);
  };

  const loginWithFacebook = async () => {
    const result = await signInWithPopup(auth, new FacebookAuthProvider());
    await handleUserRecord(result.user);
  };

  const loginWithEmail = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await handleUserRecord(result.user);
  };

  const registerWithEmail = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await handleUserRecord(result.user, true); // Новый пользователь
  };

  const logout = () => signOut(auth);

  // --- 👤 Создание/обновление записи в Firestore ---
  const handleUserRecord = async (user, isNew = false) => {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: user.email === 'admin@rescuetails.org' ? 'admin' : 'user',
        createdAt: new Date()
      });
    } else if (isNew === false) {
      // Обновим почту на всякий случай
      await updateDoc(userRef, {
        email: user.email
      });
    }

    const updated = await getDoc(userRef);
    setUserData(updated.data());
  };

  // --- 🧠 Слушаем логин/логаут ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setUserData(snap.data());
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: userData,
        firebaseUser,
        loading,
        loginWithGoogle,
        loginWithFacebook,
        loginWithEmail,
        registerWithEmail,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
