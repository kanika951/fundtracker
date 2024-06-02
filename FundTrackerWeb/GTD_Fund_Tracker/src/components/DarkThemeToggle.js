import { Switch } from "antd";
import {RightCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const DarkThemeToggle = ({ darkMode, setDarkMode }) => {
  const [theme, setTheme] = useState("light-theme");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  

  const onChange = (checked) => {
    setDarkMode(!darkMode);
    if (theme === "light-theme" || darkMode === false) {
      setTheme("dark-theme");
    } else if (darkMode === true) {
      setTheme("light-theme");
    }

    console.log(`switch to ${checked}`);
  };
  return (
    <div  className="darkmode-switch">
      <Switch
      
        checkedChildren="On"
        unCheckedChildren="Off"
        onChange={onChange}
      />
    </div>
  );
};

export default DarkThemeToggle;
