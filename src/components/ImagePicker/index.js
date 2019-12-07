import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {
  Container,
  Header,
  Content,
  Text,
  Button,
  Thumbnail,
  Body,
  View,
  Toast
} from "native-base";
import styles from "./styles";
import uploadImageIcon from "../../assets/upload-photo.png";
import url from "../../../endpoint";

const options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class ImagePickerComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      productName: "",
      image: uploadImageIcon,
      offset: {
        x: 0,
        y: 0
      }
    };
  }

  // => async() 
  sendRequestToServer = async(data) => {
    try{
      this.setState({
        productName: ""
      });
      console.log("===============Data===============");
      console.log(data);
      console.log("===============Data===============");
      const res = await axios.post(`${url}/shades`, data);
      console.log("===============Response===============");
      console.log(res.data);
      console.log("===============Response===============");
      if (res.data.status === 'success') {
          this.setState({
            loader: false,
            productName: res.data.productName
          });
      } else {
        this.setState({
          loader: false
        });
        Toast.show({
          text: `Error: ${res.data.message}`,
          type: 'error',
          duration: 3000,
          position: 'top'
        });
      }
    } catch (error) {
      this.setState({
        loader: false
      });
      Toast.show({
        text: `${error}`,
        type: 'error',
        duration: 3000,
        position: 'top'
      });
    }
  }

  sendQuery = () =>  {
    if(this.state.image == uploadImageIcon) {
      Toast.show({
        text: 'Please capture a picture or select from gallery!',
        type: 'error',
        duration: 3000,
        position: 'top'
      });
    } else {
      this.setState({
        loader: true
      });
      const formData = new FormData();
      formData.append('image', {
        uri: this.state.image,
        type: 'image/jpeg',
        name: `_${new Date()}.jpg`,
      });
      this.sendRequestToServer(formData);
    }
  }
  

  openImagePicker = () => {
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          image: response.uri,
        });
      }
    });
  }

  render() {
    return (
      <Container style={{ backgroundColor: "#FFF" }}>
        <Header>
          <Body>
            <Text style={{ fontWeight: "bold", color: "white" }}>Suggest Product Demo</Text>
          </Body>
        </Header>
        <Content
          showsVerticalScrollIndicator={false}
          style={{marginTop: 100}}
          contentOffset={this.state.offset}
          scrollEnabled={true}
        >
          <View style={styles.feedbackContainer}>
            <Button style={styles.imageInputStyle} onPress={this.openImagePicker}>
              <View style={{ width: "100%", marginTop: 5, marginBottom: 30 }}>
                <Text style={styles.uploadTextStyle}>Upload Photo</Text>
                <View style={styles.bottomStyle}>
                  {this.state.image == uploadImageIcon ? (
                    <Thumbnail
                      style={styles.bottomImageStyle}
                      source={this.state.image}
                      // source={{uri:this.state.image}}

                    />
                  ) : (
                    <Thumbnail
                      style={styles.bottomFullImg}
                      source={{uri:this.state.image}}
                    />
                  )}
                </View>
              </View>
            </Button>
            {
              this.state.loader
                ?
                  <Button
                    style={{ justifyContent: "center", alignSelf: "center", width: 125, marginVertical: 8, height: 40 }}
                  >
                    <ActivityIndicator style={{textAlign: "center"}} size="small" color="#FFF" />
                  </Button>
                :
                  <Button
                    style={{ justifyContent: "center", alignSelf: "center", width: 125, marginVertical: 8, height: 40 }}
                    onPress={this.sendQuery}
                  >
                    <Text style={{ color: "#FFF", alignSelf: "center" }}>Send Photo</Text>
                  </Button>
            }
            {
              this.state.productName != ""
                  &&
                      <View style={{flexDirection: "row", marginTop: 50, justifyContent: "center"}}>
                          <Text style={{fontWeight: "bold"}}>Product Name: </Text>
                          <Text>{this.state.productName}</Text>
                      </View>
            }
          </View>
        </Content>
      </Container>
    );
  }
}


export default ImagePickerComponent;