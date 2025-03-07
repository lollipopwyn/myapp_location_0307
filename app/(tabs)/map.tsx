import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';        // 화면에 버튼, 글자 등을 넣기 위함
import MapView, { Polygon, Region } from 'react-native-maps';         //지도와 다각형을 그리기 위함
import * as Location from 'expo-location';                            //내 위치를 알아내기 위함
import { fetchBuildings, Building } from '../api/api';                //서버에서 건물 데이터를 가져오는 함수


const MapScreen: React.FC = () => {
  // MapScreen이라는 화면을 만드는 함수
 const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);      // 내 위치를 저장할 곳, 처음엔 null
 const [buildings, setBuildings] = useState<Building[]>([]);                                //건물 데이터를 저장할 곳, 처음엔 빈 리스트
 const [errorMsg, setErrorMsg] = useState<string | null>(null);                             //오류 메시지를 저장할 곳, 처음엔 null
 const [region, setRegion] = useState<Region>({
  // 지도에서 보일 기본 위치와 크기 지정
   latitude: 37.78825,        //남북 위치
   longitude: -122.4324,      //동서 위치
   latitudeDelta: 0.0922,     //지도 세로 크기
   longitudeDelta: 0.0421,    //지도 가로 크기
 });


 useEffect(() => {
  // 화면이 시작되면 실행
   (async () => {    //위치를 가져오는 일을 기다려야 해서 이렇게 함
     let { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
       setErrorMsg('위치 권한이 거부되었습니다.');
       return;
     }
     let loc = await Location.getCurrentPositionAsync({});          //내 현재 위치를 가져옴
     setLocation(loc.coords);                                       // 내 위치 저장
     setRegion({                                                   // 지도 위치를 내 위치로 변경                      
       latitude: loc.coords.latitude,
       longitude: loc.coords.longitude,
       latitudeDelta: 0.0922,
       longitudeDelta: 0.0421,
     });
   })();    // 이걸 바로 실행해요
 }, []);    // 이건 처음 한 번만 실행


 // 버튼을 누르면 건물 데이터를 가져오는 함수
 //  내 위치가 없으면 더 이상 진행 안함
 const handleFetchBuildings = async () => {
   if (!location) {
     setErrorMsg('위치를 가져올 수 없습니다.');
     return;
   }
   try {  // 건물 데이터를 가져오는 함수를 실행         
     const data = await fetchBuildings(region.longitude, region.latitude, 100);   //서버에서 건물 데이터를 가져옴
     console.log('받은 건물 데이터:', data); // (확인용)
     setBuildings(data);                    // 건물 데이터를 저장
   } catch (error) {
     setErrorMsg('건물 데이터를 가져오는 데 실패했습니다.');
   }
 };


 return (
   <View style={styles.container}>
     <MapView
       style={styles.map}     /// 지도 크기를 설정
       region={region}        //지도에서 보일 위치와 크기를 설정
       onRegionChangeComplete={(newRegion: Region) => setRegion(newRegion)}     // 지도를 움직이면 새 위치로 업데이트
     >
       {buildings.map((building, index) => ( //건물 데이터를 하나씩 가져와서 다각형으로 그림
         building.bldg_geom.coordinates.map((polygon, polyIndex) => (
           // 지도에 네모나 다각형을 그림
           <Polygon
             key={`${index}-${polyIndex}`}    // 각 다각형에 고유한 이름 부여
             coordinates={polygon[0].map(coord => ({  // 다각형의 점들을 지도에 맞게 변환
               latitude: coord[1],            // y좌표를 위도로
               longitude: coord[0],           // x좌표를 경도로
             }))}
             fillColor="rgba(190, 89, 133, 0.5)"
             strokeColor="rgb(236, 127, 169)"
           />
         ))
       ))}
     </MapView>
     <View style={styles.buttonContainer}>
       <Button title="내 위치로 주변 건물 조회" onPress={handleFetchBuildings} color="#fff" /> 
     </View>
     {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
   </View>
 );
};

// 화면 스타일을 설정
const styles = StyleSheet.create({
 container: { flex: 1 },
 map: { flex: 1 },
 buttonContainer: {
   position: 'absolute',
   bottom: 100, // 버튼을 좀 더 위로 올리기 위해 조정
   left: '50%',
   transform: [{ translateX: -75 }], // 버튼을 중앙으로 맞추기 위해 추가
   width: 150, // 버튼의 너비를 설정
   backgroundColor: '#BE5985', // 버튼 배경색 추가
   borderRadius: 15, // 버튼 모서리를 둥글게
   padding: 10, // 버튼 내부 여백 추가
 },
 errorText: { position: 'absolute', top: 50, left: 20, color: 'red' },
});


export default MapScreen;

