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

import MapView, {AnimatedRegion, Animated} from 'react-native-maps';

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
                latitudeDelta: this.state.region.latitudeDelta,
                longitudeDelta: this.state.region.longitudeDelta,
            }});
            this.map.animateToRegion(this.state.region);
        });
    };

    render(){
        return (
            <MapView
                style={{ flex: 1 }}
                ref = {(map) => {this.map = map}}
                initialRegion={this.state.region}
            />
        );
    }
}
