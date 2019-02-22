import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Constants, Location, Permissions } from 'expo';

import MapView, {Marker, AnimatedRegion, Animated} from 'react-native-maps';

import { MonoText } from '../components/StyledText';




export default class MapsScreen extends React.Component{

    constructor(){
        super();
        this.state = {
            region: {
                latitude: 43.6532,
                longitude: -79.3832,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
			id: 0,
            markers: [],
        };
    };
		
    componentDidMount(){
        // Part of the component lifecycle, also could throw this in the constructor i guess.
        this._getLocationAsync();
    };


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Location permission denied!'
            });
        }

        // location is a promise. 
        let location = Location.getCurrentPositionAsync({});
        // When the promise is fulfilled, execute the following.
        // Fat arrow keeps 'this' in proper scope without binding.
        location.then( (loc) => {
            this.setState({region: {
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.008,
                longitudeDelta: 0.008,
            }});
            this.map.animateToRegion(this.state.region);
        });
    };

    onMapPress = (e) => {
        console.log(e);
        // e.nativeEvent is what we want
        // e.g.,
        // e.nativeEvent.coordinate.latitude
        // e.nativeEvent.position.y
        //      // ^ screen position probably?
        //
        // On map press, put a marker at press.
		this.setState({
		  markers: [
			{
			  coordinate: e.nativeEvent.coordinate,
			  key: this.state.id++,
			  color: '#ff0000',
              title: "Loading data for " + JSON.stringify(e.nativeEvent.coordinate),
			},
		  ],
		});

        // Now, let's grab the data from my REST api
        // fetch returns promises
        console.log(" calling REST api ")
        let apiCall = fetch('http://mosiman.ca/parkingtoronto/streetsegapi', {
            method: 'POST', 
            body: JSON.stringify({
                lat: e.nativeEvent.coordinate.latitude,
                lng: e.nativeEvent.coordinate.longitude,
            })
        })
        apiCall.then( (resp) => {
            console.log(resp)
        })
    };

    render(){
        return (
            <MapView
                style={{ flex: 1 }}
                ref = {(map) => {this.map = map}}
                initialRegion={this.state.region}
                onPress={ (e) => this.onMapPress(e) }
            >
            {this.state.markers.map(marker => (
                <Marker
                  key={marker.key}
                  coordinate={marker.coordinate}
                  pinColor={marker.color}
                  title={marker.title}
                />
            ))}
            </MapView>
        );
    }
}
