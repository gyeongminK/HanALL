import Link from "next/link";
import { IMainList } from "../../../types";
import { InfoListPage } from "../InfoListPage/InfoListPage";
import { Button } from "../Button/Button";
import { Title } from "../Title/Title";
import { MWContainer } from "../MWContainer/MWContainer";
import style from "./MainPage.module.scss";

export const MainInfo = ({
  spellingList,
  spacingList,
}: {
  spellingList: IMainList;
  spacingList: IMainList;
}) => {
  const renderMainInfo = (list: IMainList, title: string, link: string) => {
    return (
      <div className={style.MainInfo}>
        <Link href={link} passHref>
          <div className="flex-between">
            <Title>{title}</Title>
            <Button color="white" outline>
              더보기
            </Button>
          </div>
        </Link>
        <div>
          <Title color="blue" size="small">
            다른 사람들이 많이 봤어요!
          </Title>
          <InfoListPage list={list.hits_order} type="hits" />
          <Title color="blue" size="small">
            새로 추가됐어요!
          </Title>
          <InfoListPage list={list.created_at_order} type="created_at" />
        </div>
      </div>
    );
  };

  return (
    <MWContainer tablet>
      {spellingList && renderMainInfo(spellingList, "철자", "/spelling")}
      {spacingList && renderMainInfo(spacingList, "띄어쓰기", "/spacing")}
    </MWContainer>
  );
};
