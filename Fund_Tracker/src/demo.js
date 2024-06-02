import React, { useEffect, useState } from "react";

// const useMountEffect = (fun) => useEffect(fun, [])

const Demo = () => {
  const [options, setOptions] = useState();

  async function getUsers() {
    const usersResponse = await fetch(
      "https://localhost:44305/api/admin/verified-usernames",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log("demo result:",result);
        return result;
      });

    // 
  }

//   useMountEffect(() => {
//         console.log("inside useEffect");
    
//         getUsers();
//       })
  useEffect(() => {
    console.log("inside useEffect");

    // getUsers();
  },[]);
  return <div>demo</div>;
};

export default Demo;
