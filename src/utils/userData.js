const storedUserData = localStorage.getItem("UserData");

export const userData = storedUserData ? JSON.parse(storedUserData) : {};
