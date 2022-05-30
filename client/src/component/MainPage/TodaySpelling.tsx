import React, { useState, useEffect } from "react";
import { getTodayInfo } from "../../services/user-service";

export const TodaySpelling = () => {
  const [todayInfo, setTodayInfo] = useState({
    title: "",
    right_words: "",
    description: "",
    helpful_info: "",
    related: "",
  });

  const getData = async () => {
    const info = await getTodayInfo();
    setTodayInfo(info);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div>오늘의 맞춤법</div>
      <div>{todayInfo.title}</div>
      <div>
        <div>😄 옳은 표현: {todayInfo.right_words}</div>
        <div>{todayInfo.description}</div>
        <div>{todayInfo.helpful_info}</div>
        {todayInfo.related && <div>친구 {todayInfo.related}</div>}
      </div>
    </>
  );
};
