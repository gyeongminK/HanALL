import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IScrap } from "../types";
import { getScrapList } from "../src/services/auth-service";
import { ScrapList } from "../src/component/ScrapPage/ScrapList";
import { Title } from "../src/component/Title/Title";
import { MWContainer } from "../src/component/MWContainer/MWContainer";
import { Button } from "../src/component/Button/Button";

const Scrap: NextPage = () => {
  const router = useRouter();

  const [scraps, setScraps] = useState<IScrap>();
  const getData = async () => {
    const list = await getScrapList();
    setScraps(list);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Button onClick={() => router.push("/test")}>시험 응시</Button>
      {scraps && (
        <MWContainer>
          <div>
            <Title size="mid">철자</Title>
            <ScrapList scraps={scraps?.spelling} />
          </div>
          <div>
            <Title size="mid">띄어쓰기</Title>
            <ScrapList scraps={scraps?.spacing} />
          </div>
        </MWContainer>
      )}
    </div>
  );
};

export default Scrap;
