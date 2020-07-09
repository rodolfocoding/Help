import React, {useState} from 'react';
import {StyleSheet, PermissionsAndroid, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  ViewContainer,
  ViewPositionBox,
  PositioBoxTitle,
  PositonBoxLatLon,
  TextLatLon,
  LocationButton,
} from './styles';
import MapView, {Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
const MapRegion: React.FC = () => {
  const [position, setPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  function onSignOut() {
    AsyncStorage.removeItem('@storage_Key');
    navigation.goBack('Login');
  }
  const navigation = useNavigation();

  const myApiKey = 'AIzaSyDYaCDbthjkd_tdp2-CEXX5iOt2XD2h0_Q';

  const request_location_runtime_permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permissão de Localização',
          message: 'A aplicação precisa da permissão de localização.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (pos) => {
            setPosition({
              ...position,
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
          (error) => {
            console.log(error);
            Alert.alert('Houve um erro ao pegar a latitude e longitude.');
          },
        );
      } else {
        Alert.alert('Permissão de localização não concedida');
      }
    } catch (err) {
      console.log(err);
    }
  };

  function geocoding() {
    Geocoder.init(myApiKey);

    Geocoder.from(position.latitude, position.longitude)
      .then((json: object) => {
        const neighborhood = json.results[0].address_components[2];
        const city = json.results[0].address_components[3];
        const number = json.results[0].address_components[0];
        const street = json.results[0].address_components[1];

        return street;
      })
      .catch((error: string) => console.warn(error));
  }

  const results = geocoding();

  return (
    <ViewContainer>
      <MapView
        style={styles.map}
        region={position}
        onPress={(e) => {
          setPosition({
            ...position,
            latitude: e.nativeEvent.coordinate.latitude,
            longitude: e.nativeEvent.coordinate.longitude,
          });
          geocoding();
        }}>
        <Marker
          coordinate={position}
          title={'Você'}
          description={'Localização Atual'}
        />
      </MapView>
      <ViewPositionBox>
        <PositioBoxTitle>Sua Localização</PositioBoxTitle>
        <PositonBoxLatLon>
          <TextLatLon>Lat.</TextLatLon>
          <TextLatLon>{results}</TextLatLon>
        </PositonBoxLatLon>
        <PositonBoxLatLon>
          <TextLatLon>Lon.</TextLatLon>
          <TextLatLon>{position.longitude}</TextLatLon>
        </PositonBoxLatLon>
      </ViewPositionBox>
      <LocationButton
        onPress={() => {
          request_location_runtime_permission();
          geocoding();
        }}>
        <Icon name="my-location" color={'#fff'} size={30} />
      </LocationButton>
    </ViewContainer>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: '100%',
  },
});

export default MapRegion;
