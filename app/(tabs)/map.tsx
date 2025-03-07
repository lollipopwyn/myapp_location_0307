import React, { useState, useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import MapView, { Polygon, Region } from "react-native-maps";
import * as Location from "expo-location";
import { fetchBuildings } from "../api/api"; // API 연동

interface Building {
  coordinates: { x: number; y: number }[];
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("위치 권한이 필요합니다.");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  const handleFetchBuildings = async () => {
    if (!region) {
      setErrorMsg("현재 지도 중심 좌표를 가져올 수 없습니다.");
      return;
    }
    try {
      const data = await fetchBuildings(region.longitude, region.latitude, 200);
      setBuildings(data);
    } catch (error) {
      setErrorMsg("건물 데이터를 불러오는 데 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
      >
        {buildings.map((building, index) => (
          <Polygon
            key={index}
            coordinates={building.coordinates.map(coord => ({
              latitude: coord.y,
              longitude: coord.x,
            }))}
            fillColor="rgba(255, 0, 0, 0.5)"
            strokeColor="red"
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="내 위치로 주변 건물 찾기" onPress={handleFetchBuildings} />
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    buttonContainer: { 
      position: "absolute", 
      top: "50%", 
      left: "50%", 
      transform: [{ translateX: -75 }, { translateY: -25 }], // 버튼 크기에 맞게 조정
      backgroundColor: "rgba(255, 255, 255, 0.8)", 
      padding: 10, 
      borderRadius: 10, 
    },
    errorText: { position: "absolute", top: 50, left: 20, color: "red" },
});
