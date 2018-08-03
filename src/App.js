import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import './App.css';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Helmet from "react-helmet";

const particleOptions = {
  "particles": {
    "number": {
      "value": 200,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#fff"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.5,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 10,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 500,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 2
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "bottom",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "repulse"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 0.5
        }
      },
      "bubble": {
        "distance": 400,
        "size": 4,
        "duration": 0.3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}

const initState = {
  input: '',
  imageUrl:'',
  leftColarray:'',
  rightColarray:'',
  botRowarray:'',
  topRowarray:'',
  route:'signin',
  isSignedIn:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    faceNumber:''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
      faceNumber:data.faceNumber
    }})
  }

  calculateFaceLocation =(data)=>{
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const arrayData=[];
    const array =  data.outputs[0].data.regions;
    for(let i = 0; i < array.length; i++){
      arrayData.push(array[i].region_info)
    }
    //console.log(arrayData);

    const leftCol = [];
    const topRow = [];
    const rightCol = [];
    const botRow = [];
    for(let x = 0; x < arrayData.length; x++){
      leftCol.push(arrayData[x].bounding_box.left_col * width);
      topRow.push(arrayData[x].bounding_box.top_row * height);
      rightCol.push(width - arrayData[x].bounding_box.right_col * width);
      botRow.push(height - arrayData[x].bounding_box.bottom_row * height);
    }
    return{
      leftColarray: leftCol,
      topRowarray: topRow,
      rightColarray: rightCol,
      botRowarray: botRow
    }
  }

  onInputChange = (event) =>{
    this.setState({input:event.target.value});
  }

  displayBox = (data) =>{
    this.setState({leftColarray: data.leftColarray});
    this.setState({rightColarray:data.rightColarray});
    this.setState({botRowarray: data.botRowarray});
    this.setState({topRowarray: data.topRowarray});
  }

  onButtonSubmit = () =>{
    this.setState({imageUrl:this.state.input});
    fetch('https://facebackend.herokuapp.com/imageUrl',{
      method:'post',
      headers: {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    }) 
    .then(response => response.json())
    .then(data => {
      if(data) {
        const number = JSON.stringify(data.outputs[0].data.regions.length);
        fetch('https://facebackend.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id,
            faceNumber: number,
            entries:this.state.user.entries
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayBox(this.calculateFaceLocation(data));
    })
    .catch(err => console.log(err));
  }

  

  onRouteChange = (route) =>{
    if(route === 'signout' ){
      this.setState(initState);
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
        <Helmet>  
          <title>Face Recognition</title>
        </Helmet>
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation isSignedIn = {this.state.isSignedIn} onRouteChange = {this.onRouteChange}/>
        { this.state.route === 'home' 
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition leftColarray={this.state.leftColarray}
                             rightColarray={this.state.rightColarray}
                             botRowarray={this.state.botRowarray}
                             topRowarray={this.state.topRowarray}
                             imageUrl={this.state.imageUrl}/>
            </div>
          : (
            this.state.route === 'signin'
            ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange } />
            :<Register loadUser ={this.loadUser} onRouteChange = {this.onRouteChange}/>
            ) 
        }      
      </div>
    );
  }
}

export default App;