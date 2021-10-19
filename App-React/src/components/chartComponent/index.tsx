import React, {useEffect, useState, useContext} from 'react';
import {Container, TitleChart} from './style';
import firestore from '@react-native-firebase/firestore';
import AuthContext from '../../contexts/auth';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  ChartDataPoint,
} from 'react-native-responsive-linechart';

const ChartComponent: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const {getUserAsyncStorage} = useContext(AuthContext);
  const [email, setEmail] = useState<string | null>();
  const [facebookId, setFacebookId] = useState<string | null>();
  const styledChart = {height: 200, width: '100%'};

  useEffect(() => {
    async function getUser() {
      await getUserAsyncStorage().then(user => {
        const jsonUser = JSON.parse(user as string);
        setEmail(jsonUser.email);
        setFacebookId(jsonUser.id);
      });
    }

    async function getHistoryKwh() {
      try {
        await firestore()
          .collection('history_kwh')
          .doc(`${email}`)
          .collection(`${facebookId}`)
          .limit(11)
          .get()
          .then(res => {
            let array: ChartDataPoint[] = [];
            res.forEach((dataRes, index) => {
              array.push({x: index, y: dataRes.data().kwh});
            });

            array.unshift();
            setData(array);
          });
      } catch (error) {
        console.error(error);
      }
    }
    getHistoryKwh();
    getUser();
  }, [getUserAsyncStorage, email, facebookId]);

  return (
    <Container>
      {data.length > 0 && (
        <>
          <TitleChart>Chart Consumo de energia </TitleChart>

          <Chart
            style={styledChart}
            data={data}
            padding={{left: 50, bottom: 20, right: 20, top: 20}}>
            <VerticalAxis
              tickCount={5}
              theme={{labels: {formatter: v => v.toFixed(2)}}}
            />
            <HorizontalAxis tickCount={5} />
            <Area
              theme={{
                gradient: {
                  from: {color: '#39A5C7'},
                  to: {color: '#39A5C7', opacity: 0.4},
                },
              }}
            />
            <Line
              theme={{
                stroke: {color: '#39A5C7', width: 2},
                scatter: {default: {width: 4, height: 4, rx: 2}},
              }}
            />
          </Chart>
        </>
      )}

      {data.length === 0 && <TitleChart>Empty data Chart </TitleChart>}
    </Container>
  );
};

export default ChartComponent;
