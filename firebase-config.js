// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 1. ใส่ config จาก Firebase Console ของคุณ
const firebaseConfig = {

    apiKey: "AIzaSyBaydX37H-KjhsWiNX3ZAYi-DxAeXo0axg",

    authDomain: "somebs-28984.firebaseapp.com",

    projectId: "somebs-28984",

    storageBucket: "somebs-28984.firebasestorage.app",

    messagingSenderId: "973667043459",

    appId: "1:973667043459:web:33b16b74c19e36b061b3b6",

    measurementId: "G-MCRPQJCM7E"

};



// 2. Initialize Core Services (ตัด Storage ออกแล้ว)
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 3. ฟังก์ชันจัดการข้อมูล (Firestore)
export async function addClothingItem(item) {
    try {
        const docRef = await addDoc(collection(db, "clothing_items"), item);
        console.log("บันทึกสำเร็จ ID:", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("เกิดข้อผิดพลาดในการบันทึก:", e);
        throw e;
    }
}

export async function fetchClothingItems() {
    const querySnapshot = await getDocs(collection(db, "clothing_items"));
    const items = [];
    querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
    });
    return items;
}

// 4. ฟังก์ชันจัดการระบบสมาชิก (Auth)
const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("ล็อกอินสำเร็จ ผู้ใช้:", result.user.displayName);
        return result.user;
    } catch (error) {
        console.error("เข้าสู่ระบบด้วย Google ไม่สำเร็จ:", error);
        throw error;
    }
}

export async function signUp(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("สมัครสมาชิกสำเร็จ:", userCredential.user);
        return userCredential.user;
    } catch (error) {
        console.error("สมัครสมาชิกไม่สำเร็จ:", error.code, error.message);
        throw error;
    }
}

export async function logout() {
    try {
        await signOut(auth);
        console.log("ออกจากระบบสำเร็จ");
    } catch (error) {
        console.error("ออกจากระบบไม่สำเร็จ:", error);
        throw error;
    }
}

export { onAuthStateChanged };
