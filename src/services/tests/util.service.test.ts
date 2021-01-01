import { getStationName, getStation, getPolyLineFromStations, getLineTypeFromFareType, isInterchangeStation, isExtensionBorderStation, getStationIdsFromJourney, getFareTypeFromStationId, getAllStations, calculateFareFromRouteSegment } from '../util.service';
import { MRT_BLUE_STATION_ID, LineType, BTS_SILOM_STATION_ID, METRO_STATION_ID, Station, FareType, BTS_SUKHUMVIT_STATION_ID, Journey, ARL_STATION_ID, BRT_STATION_ID } from '../../types';

describe('Util Service', () => {
    const station: Station = {
        lineType: LineType.MRT_BLUE,
        id: MRT_BLUE_STATION_ID.BANG_WA,
        nameEN: 'english',
        nameTH: 'thai',
        isNotAvailable: false,
        position: [0, 0]
    };
    describe('getStationName', () => {
        it('should return en name when given language is en', () => {
            const name = getStationName(station, 'en');
            expect(name).toBe(station.nameEN);
        });
        it('should return th name when given language is th', () => {
            const name = getStationName(station, 'th');
            expect(name).toBe(station.nameTH);
        });
    });
    describe('getStation', () => {
        it('should return bts bangwa station', () => {
            const station = getStation(BTS_SILOM_STATION_ID.BANG_WA);

            expect(station).not.toBeUndefined();
            expect(station?.id).toBe(BTS_SILOM_STATION_ID.BANG_WA);
        });
        it('should return null if station id is not in the list', () => {
            const station = getStation('undefined' as METRO_STATION_ID);

            expect(station).toBeUndefined()
        });
    });
    describe('getPolyLineFromStations', () => {
        it('should return array of stations position', () => {
            const stations: Station[] = [
                {
                    ...station,
                    position: [0, 0]
                },
                {
                    ...station,
                    position: [1, 1]
                }
            ];
            const polyline = getPolyLineFromStations(stations);
            expect(polyline).toMatchObject([
                [0, 0],
                [1, 1]
            ])
        });
        it('should return empty array if no station', () => {
            const stations: Station[] = [];
            const polyline = getPolyLineFromStations(stations);
            expect(polyline).toMatchObject([]);
        });
    });
    describe('getLineTypeFromFareType', () => {
        const mappingFareTypeToLineType = [
            { fareType: FareType.BTS, lineType: LineType.BTS },
            { fareType: FareType.BTS_SILOM_EXTENSION_15, lineType: LineType.BTS_SILOM },
            { fareType: FareType.BTS_SUKHUMVIT_EXTENSION_15, lineType: LineType.BTS_SUKHUMVIT },
            { fareType: FareType.BTS_SUKHUMVIT_EXTENSION_0, lineType: LineType.BTS_SUKHUMVIT },
            { fareType: FareType.ARL, lineType: LineType.ARL },
            { fareType: FareType.BRT, lineType: LineType.BRT },
            { fareType: FareType.MRT_BLUE, lineType: LineType.MRT_BLUE },
        ];
        mappingFareTypeToLineType.forEach(mapping => {
            it(`should return ${mapping.lineType} when fare type is ${mapping.fareType}`, () => {
                const lineType = getLineTypeFromFareType(mapping.fareType);
                expect(lineType).toBe(mapping.lineType);
            });
        })
    });
    describe('isInterchangeStation', () => {
        it('should return true if station is interchange', () => {
            const station = MRT_BLUE_STATION_ID.SILOM;
            expect(isInterchangeStation(station)).toBeTruthy();
        });
        it('should return false if station is not interchange', () => {
            const station = MRT_BLUE_STATION_ID.LUMPHINI;
            expect(isInterchangeStation(station)).toBeFalsy();
        });
    });
    describe('isExtensionBorderStation', () => {
        it('should return true if station is extension border', () => {
            const station = BTS_SUKHUMVIT_STATION_ID.MO_CHIT;
            expect(isExtensionBorderStation(station)).toBeTruthy();
        });
        it('should return false if station is not extension border', () => {
            const station = BTS_SUKHUMVIT_STATION_ID.SIAM;
            expect(isExtensionBorderStation(station)).toBeFalsy();
        });
    });
    describe('getStationIdsFromJourney', () => {
        it('should return list of station id from journey', () => {
            const journey: Journey = {
                route: [{
                    route: [MRT_BLUE_STATION_ID.SILOM, MRT_BLUE_STATION_ID.LUMPHINI],
                    lineType: LineType.MRT_BLUE,
                    fare: 0
                }, {
                    route: [BTS_SUKHUMVIT_STATION_ID.ARI, BTS_SUKHUMVIT_STATION_ID.ASOK],
                    lineType: LineType.BTS_SUKHUMVIT,
                    fare: 0
                }],
                fare: 0,
                from: MRT_BLUE_STATION_ID.SILOM,
                to: MRT_BLUE_STATION_ID.LUMPHINI
            };

            const stationIds = getStationIdsFromJourney(journey);
            const expectedResult: METRO_STATION_ID[] = [MRT_BLUE_STATION_ID.SILOM, MRT_BLUE_STATION_ID.LUMPHINI, BTS_SUKHUMVIT_STATION_ID.ARI, BTS_SUKHUMVIT_STATION_ID.ASOK];
            expect(stationIds).toMatchObject(expectedResult);
        });
    });
    describe('getFareTypeFromStationId', () => {
        const mappingStationIdToFareType = [
            { station: ARL_STATION_ID.MAKKASAN, fareType: FareType.ARL },
            { station: BRT_STATION_ID.RATCHAPRUEK, fareType: FareType.BRT },
            { station: BTS_SILOM_STATION_ID.BANG_WA, fareType: FareType.BTS_SILOM_EXTENSION_15 },
            { station: BTS_SUKHUMVIT_STATION_ID.BANG_NA, fareType: FareType.BTS_SUKHUMVIT_EXTENSION_15 },
            { station: BTS_SUKHUMVIT_STATION_ID.WAT_PHRA_SRI_MAHATHAT, fareType: FareType.BTS_SUKHUMVIT_EXTENSION_0 },
            { station: BTS_SILOM_STATION_ID.SIAM, fareType: FareType.BTS },
            { station: BTS_SUKHUMVIT_STATION_ID.VICTORY_MONUMENT, fareType: FareType.BTS },
            { station: MRT_BLUE_STATION_ID.PHETKASEM_48, fareType: FareType.MRT_BLUE },
        ];
        mappingStationIdToFareType.forEach(mapping => {
            it(`should return ${mapping.fareType} if station id is ${mapping.station}`, () => {
                const fareType = getFareTypeFromStationId(mapping.station)
                expect(fareType).toBe(mapping.fareType);
            });
        })
    });
    describe('getAllStations', () => {
        it('should return all stations from given staion id', () => {
            const stationIds = [MRT_BLUE_STATION_ID.LUMPHINI, MRT_BLUE_STATION_ID.PHAHON_YOTHIN];
            const stations = getAllStations(stationIds);
            const expectedResult: Station[] = [
                { lineType: LineType.MRT_BLUE, id: MRT_BLUE_STATION_ID.LUMPHINI, nameEN: "Lumphini", nameTH: "ลุมพินี", position: [13.725501, 100.545714] },
                { lineType: LineType.MRT_BLUE, id: MRT_BLUE_STATION_ID.PHAHON_YOTHIN, nameEN: "Phahon Yothin", nameTH: "พหลโยธิน", position: [13.812951, 100.561568] },
            ];
            expect(stations).toMatchObject(expectedResult);
        });
    });
})