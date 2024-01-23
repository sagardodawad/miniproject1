import React from "react";
import Username from "./Usersname"
const Adminhome = () => {
  const handleLogout = () => {
    localStorage.removeItem("token1");
    window.location.reload();
  };
  return (
    <>
      <button onClick={handleLogout}>Logout</button>
      <div>
        <div>
          <h1>Registered Users Reports</h1>
           <Username/>
        </div>
      </div>
    </>
  );
};

export default Adminhome;
