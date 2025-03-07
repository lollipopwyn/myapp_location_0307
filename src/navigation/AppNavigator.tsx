// 탭 네비게이션을 설정하여 '지도' 탭 추가
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from '../components/MapScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="지도" component={MapScreen} />
      {/* 필요 시 다른 탭 추가 가능 */}
    </Tab.Navigator>
  );
};

export default AppNavigator;