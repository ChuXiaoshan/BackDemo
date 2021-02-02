import React, { useRef } from "react";
import { Button, View, Text, Platform, BackHandler} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-simple-toast';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation}) {

  const webViewRef = useRef(null)

  const goBack = () => {
    Toast.show( 'goBack');
    if(canGoBack) {
        webViewRef.current.goBack();
    } else {
        navigation.goBack();
    }
  };

  var canGoBack = false

  React.useEffect(() => {
    Toast.show( 'focused');
    if(Platform.OS === "android") {
        BackHandler.addEventListener('hardwareBackPress', () =>{
            if(canGoBack){
                webViewRef.current.goBack()
                return true
            } else {
//                navigation.goBack()
                return false
            }
        })
    }
    return () => {
        Toast.show( 'dismiss');
        BackHandler.removeEventListener('hardwareBackPress',()=>{})
    }
    })

  React.useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <Button onPress={goBack} title="返回" />
          ),
        });
      }, [navigation]);

 return (
      <WebView
        ref={webViewRef}
        source={{uri: 'https://www.baidu.com/'}}
        onNavigationStateChange={(event)=>{
            console.log(event)
            canGoBack = event.canGoBack
        }}
      />
     );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;