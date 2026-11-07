import { useState, useEffect } from "react";

interface IUser {
  id: number;
  name: string;
}
export default function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/users");
      if (!response.ok) {
        throw new Error("Error on fetching request");
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    fetchData();
  }, [])
  return <>
    {users.map(user => <li key="{user.id" > { user.name }</li>)}
  </>
}