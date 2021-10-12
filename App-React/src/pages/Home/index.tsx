import React, {useEffect, useState} from 'react';

import {
  Container,
  DigitalBg,
  TitleConsumo,
  TitleValue,
  TitleKWH,
  InfoDigital,
  TitleInfo,
  TitleDate,
  TitleDateInfo,
  Flag,
  TextFlag,
  ContainerDigital,
  TitleInfoMonth,
} from './style';

import bgDigital from '../../assets/bg-digital.png';
import ShapeComponent from '../../components/shapeComponent';
import StatusBarComponent from '../../components/StatusBarComponent';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

import database from '@react-native-firebase/database';

import Icon from 'react-native-vector-icons/Feather';

function LogoutComponent() {
  return (
    <Container>
      <ShapeComponent />
    </Container>
  );
}

function GraphComponent() {
  return (
    <Container>
      <ShapeComponent />
    </Container>
  );
}
interface Consumpotion {
  data: string;
  date_time: string;
  kwh: number;
  value: number;
}

function DigialScreen() {
  const [consumption, setConsumption] = useState<Consumpotion | null>(null);

  useEffect(() => {
    async function reader() {
      await database()
        .ref('/consumption_kwth')
        .on('child_added', snapshot => {
          console.log('A new node has been added', snapshot.val());
          setConsumption(snapshot.val());
        });
    }

    reader();
  }, []);

  return (
    <Container>
      <ShapeComponent />
      <ContainerDigital>
        <DigitalBg source={bgDigital} resizeMode="cover">
          <TitleConsumo>Consumption</TitleConsumo>
          <TitleValue>
            {consumption !== null ? consumption.kwh : '00,00'}{' '}
          </TitleValue>
          <TitleKWH>KWH</TitleKWH>
        </DigitalBg>

        <InfoDigital>
          <TitleInfoMonth>Month</TitleInfoMonth>
          <TitleInfo>
            R$ {consumption !== null ? consumption.value : '00,00'}
          </TitleInfo>
          <TitleDate>Date</TitleDate>
          <TitleDateInfo>
            {consumption !== null ? consumption.date_time : '00/00'}
          </TitleDateInfo>
          <Flag>
            <Icon size={24} name="flag" color="yellow" />
            <TextFlag>Yellow card</TextFlag>
          </Flag>
        </InfoDigital>
      </ContainerDigital>
    </Container>
  );
}

const Home: React.FC = () => {
  return (
    <>
      <StatusBarComponent />
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            if (route.name === 'Digital') {
              iconName = focused ? 'zap' : 'zap';
            } else if (route.name === 'Graph') {
              iconName = focused ? 'pie-chart' : 'pie-chart';
            } else {
              iconName = focused ? 'power' : 'power';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#39A5C7',
          tabBarInactiveTintColor: '#C4C4C4',
        })}>
        <Tab.Screen
          name="Digital"
          component={DigialScreen}
          options={{
            headerShown: false,
            tabBarItemStyle: {
              paddingBottom: 5,
            },
          }}
        />
        <Tab.Screen
          name="Graph"
          component={GraphComponent}
          options={{
            headerShown: false,
            tabBarItemStyle: {
              paddingBottom: 5,
              shadowColor: '#ffffff',
            },
          }}
        />
        <Tab.Screen
          name="Logout"
          component={LogoutComponent}
          options={{
            headerShown: false,
            tabBarItemStyle: {
              paddingBottom: 5,
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default Home;
