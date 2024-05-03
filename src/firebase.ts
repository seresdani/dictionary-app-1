// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsybeNkOfmUEwcL0LPb748Mbw9CDbkciQ",
  authDomain: "dictionary-app-8d54e.firebaseapp.com",
  projectId: "dictionary-app-8d54e",
  storageBucket: "dictionary-app-8d54e.appspot.com",
  messagingSenderId: "512821611217",
  appId: "1:512821611217:web:0e7aa7f287451b2d6713f0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const docRef = collection(db, "cities");

export const converter = {
  toFirestore(): DocumentData {
    return {};
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
    const data = snapshot.data(options)!;
    return data?.words.map((word: Translation) => ({
      id: word.id,
      de: word.de,
      hu: word.hu,
    }));
  },
};

export const getDictionaryArray = async () => {
  const docRef = doc(db, "dictionary", "de-hu").withConverter(converter);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  else {
    return { words: [] };
  }
};

export interface Translation {
  id?: string,
  de: string,
  hu: string
}

function hashCode(str: string) {
  return Array.from(str)
    .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
}

export const saveToDictionary = async (word: Translation) => {
  try {
    const docRef = doc(db, "dictionary", "de-hu");

    const id = hashCode(word.de + word.hu).toString()

    const newData = {
      id: id,
      de: word.de,
      hu: word.hu
    }
    await updateDoc(docRef, {
      words: arrayUnion(newData),
    });
    return newData
  } catch {
    console.log("no saved data");
  }
};

export const updateDictionary = async (words: Translation[]) => {
  try {
    const docRef = doc(db, "dictionary", "de-hu");

    await updateDoc(docRef, {
      words: words,
    });
    return words

  } catch {
    console.log("no saved data");
  }
}
