import { useState, useEffect } from "react";
interface IUser {
  id: number;
  name: string;
}
export default function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/users");
      if (!response.ok) {
        console.log("something went wrong");
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false);
    }
  }
  const addUser = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      try {
        const response = await fetch("http://localhost:4000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: e.target.value }),
        });
        if (!response.ok) {
          console.log("something went wrong");
        }
        const data = await response.json();
        const newUsers = [...users, data];
        setUsers(newUsers);
      } catch (e) {
        console.log(e)
      }
    
    }
   
  }
  useEffect(() => {
    fetchData();
  }, [])
  return <>
    { loading && <p>Loading......</p>}
    <ul>
      {users.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
    <input type="text" onKeyDown={(e) => { addUser(e)}}/>
  </>
}