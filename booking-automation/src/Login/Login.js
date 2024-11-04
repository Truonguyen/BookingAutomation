import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const loginUser = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in:", userCredential.user);
    return userCredential.user; // Return the user object
  } catch (error) {
    console.error("Error logging in:", error);
  }
};

export default loginUser;
