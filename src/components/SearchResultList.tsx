import React from "react";
import { useTranslation } from "react-i18next";
import { getLineTypeLabel, getStationName } from "../services/util.service";
import { METRO_STATION, Station } from "../types";

type SearchResultListProps = {
  searchItems: Station[];
  handleOnItemClick: (_: METRO_STATION) => void;
};

export const SearchResultList = ({
  searchItems,
  handleOnItemClick,
}: SearchResultListProps) => {
  return (
    <div>
      {searchItems.length === 0 ? (
        <div>empty screen</div>
      ) : (
        <div>
          {searchItems.map((item, index) => (
            <SearchItem key={index} item={item} onClick={handleOnItemClick} />
          ))}
        </div>
      )}
    </div>
  );
};

type SearchItemProps = {
  item: Station;
  onClick: (_: METRO_STATION) => void;
};

const SearchItem = ({ item, onClick }: SearchItemProps) => {
  const { i18n } = useTranslation();
  const lineType = getLineTypeLabel(item.lineType);
  const stationName = getStationName(item, i18n.language);
  return (
    <div
      onClick={() => onClick(item.key)}
    >{`${lineType} [${item.key}] ${stationName}`}</div>
  );
};