import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap';
import React, {Component } from "react";
import './App.css';



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  var d = [
      'M',
      start.x,
      start.y,
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y
  ].join(' ');

  return d;
}

function mapNumber(number, in_min, in_max, out_min, out_max) {
  return (
      ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
}

const SVGCircle = ({ radius }) => (
  <svg className="countdown-svg">
      <path
          fill="none"
          stroke="#333"
          strokeWidth="4"
          d={describeArc(50, 50, 48, 0, radius)}
      />
  </svg>
);

class App extends Component {

// MENU 1 COUNTDOWN
  async countdown(datetime){

    this.state.i = this.state.i + 1;
    
    if (this.state.i === 2){
      this.state.i = 1;
      clearInterval(this.interval);
    }
    console.log(this.state.i) 

    this.interval = setInterval(() => { 
      const date1 = new Date();
      const date2 = new Date(datetime);

      const  dif = new Date(date2.getTime() - date1.getTime());

      var year = dif.getUTCFullYear() - 1970;
      var month = dif.getUTCMonth() ;
      var day = dif.getUTCDate() - 1;
      var hour = dif.getUTCHours() ;
      var minute = dif.getUTCMinutes() ;
      var second = dif.getUTCSeconds();

      if (dif < 0){
        year = 0;
        month = 0;
        day = 0;
        hour = 0;
        minute = 0;
        second = 0;
      }
    
      this.setState({ year, month, day, hour, minute, second});

    }, 1000);
  }
 
// MENU 2 PINATA AND IMAGEUPLOAD  
  async pinata(name, strength){   
    const pinataApiKey = "5b4324fda5106b24845f";
    const pinataSecretApiKey = "446cc7cb18e03f24097bf3fa3e20aa1a2dd23630df3e41a476b344ed8d5cc871";
    const axios = require("axios");
    const FormData = require("form-data");

    const pinFileToIPFS = async () => {
      const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
      let data = new FormData();
      data.append("file", this.state.selectedFile);
        
      const res = await axios.post(url, data, {
        maxContentLength: "Infinity", 
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey, 
          pinata_secret_api_key: pinataSecretApiKey,
        },
      });   
        
      this.state.name = name;
      this.state.strength = strength;
      this.state.ipfshash = res.data.IpfsHash;

      console.log(res.data.IpfsHash);
    };
    pinFileToIPFS();  
  } 

  async pinata2(){  
    const pinataApiKey = "5b4324fda5106b24845f";
    const pinataSecretApiKey = "446cc7cb18e03f24097bf3fa3e20aa1a2dd23630df3e41a476b344ed8d5cc871";
    const axios = require("axios");

    const pinJSONToIPFS = async() => {  

      const metadata = {
        pinataMetadata: {
          name: 'TestArt',
          keyvalues: {
            ItemID: 'Item001',
            CheckpointID: 'Checkpoint001',
            Source: 'CompanyA',
            WeightInKilos: 5.25
          }
        },
        pinataContent: {
          "name": this.state.name,
          "hash": "https://ipfs.io/ipfs/" + this.state.ipfshash, 
          "strength": this.state.strength,
          "by": "Kevin Thamrin"
        }
      }

      const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;  
      const res = await axios.post(url, metadata, {
        headers: {
          pinata_api_key: pinataApiKey, 
          pinata_secret_api_key: pinataSecretApiKey,
        },      
      });

      console.log(res.data.IpfsHash);
      this.state.ipfshash2 = res.data.IpfsHash;
    }
      pinJSONToIPFS();  
  } 

  onFileChange = event => {     
    this.setState({ selectedFile: event.target.files[0] });

    //console.log(this.state.headLength)
    //console.log(this.state.eyesLength)
    //console.log(this.state.head)
    //console.log(this.state.eyes)
    //console.log(this.state.nose)
    //console.log(this.state.mouth)
    //console.log(this.state.hair)
    //console.log(this.state.beard)
  };

  fileData = () => {
    if (this.state.selectedFile) {      
        
      return (
        <div>
          <h4>File Details:</h4>
            
          <p>File Name: {this.state.selectedFile.name}</p>      
          <p>File Type: {this.state.selectedFile.type}</p>
            
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}   
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h5>Choose before Pressing the Upload button</h5>
        </div>
      );
    }
  };

  
// MENU 3 NFT FACTORY
  inputBackground = event => {
    var background = [];
    const backgroundLength = event.target.files.length;
    this.setState({backgroundLength});

    for (var i = 0; i < event.target.files.length ; i++){
      background[i] = event.target.files[i];

      this.setState({background});
    }
  };

  inputHead = event => {
    var head = [];
    const headLength = event.target.files.length;
    this.setState({headLength});

    for (var i = 0; i < event.target.files.length; i++){
      head[i] = event.target.files[i];

      this.setState({head});
    }
  };

  inputEyes = event => {
    var eyes = [];
    const eyesLength = event.target.files.length;
    this.setState({eyesLength});

    for (var i = 0; i < event.target.files.length; i++){
      eyes[i] = event.target.files[i];

      this.setState({eyes});
    }
  };

  inputNose = event => {
    var nose = [];
    const noseLength = event.target.files.length;
    this.setState({noseLength});

    for (var i = 0; i < event.target.files.length; i++){
      nose[i] = event.target.files[i];

      this.setState({nose});
    }
  };

  inputMouth = event => {
    var mouth = [];
    const mouthLength = event.target.files.length;
    this.setState({mouthLength});

    for (var i = 0; i < event.target.files.length; i++){
      mouth[i] = event.target.files[i];

      this.setState({mouth});
    }
  };

  inputHair = event => {
    var hair = [];
    const hairLength = event.target.files.length;
    this.setState({hairLength});

    for (var i = 0; i < event.target.files.length; i++){
      hair[i] = event.target.files[i];

      this.setState({hair});
    }
  };

  inputBeard = event => {
    var beard = [];
    const beardLength = event.target.files.length;
    this.setState({beardLength});

    for (var i = 0; i < event.target.files.length; i++){
      beard[i] = event.target.files[i];

      this.setState({beard});
    }
  };

  async generate(){  

    //const max = 0;
    //const arr = {};
    let idx = 999;

    //await this.createImage();
    //this.randElement(arr);
    //this.getRandomName();


    do {
      this.createImage(idx);
      idx--;
    } while (idx >= 0);
  }

  async randInt(max ) {
    return Math.floor(Math.random() * (max + 1));
  }

  async randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }


  async getRandomName() {
    const takenNames = {};
        const adjectives = 'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(' ');
        const names = 'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(' ');
        
        const randAdj = this.randElement(adjectives);
        const randName = this.randElement(names);
        const name =  `${randAdj}-${randName}`;


        if (takenNames[name] || !name) {
            return this.getRandomName();
        } else {
            takenNames[name] = name;
            return name;
        }
  }

  async getLayer0(backgroundnum, skip=0.0) {

    const layer = await this.state.background[backgroundnum];
    //console.log(backgroundnum)
    //console.log(layer)

    return Math.random() > skip ? layer : '';
  }

  async getLayer1(headnum, skip=0.0) {

    var layer = await this.state.head[headnum]; 
    return Math.random() > skip ? layer : '';
  }

  async getLayer2(eyesnum, skip=0.0) {

    var layer = await this.state.eyes[eyesnum];
    return Math.random() > skip ? layer : '';
  }

  async getLayer3(nosenum, skip=0.0) {

    var layer = await this.state.nose[nosenum];
    return Math.random() > skip ? layer : '';
  }

  async getLayer4(mouthnum, skip=0.0) {

    var layer = await this.state.mouth[mouthnum];
    return Math.random() > skip ? layer : '';
  }

  async getLayer5(hairnum, skip=0.0) {

    var layer = await this.state.hair[hairnum];
    return Math.random() > skip ? layer : '';
  }

  async getLayer6(beardnum, skip=0.0) {

    var layer = await this.state.beard[beardnum]; 
    return Math.random() > skip ? layer : '';
  }
  
  async createImage(idx) {

    const template = `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- bg -->
          <!-- head -->
          <!-- hair -->
          <!-- eyes -->
          <!-- nose -->
          <!-- mouth -->
          <!-- beard -->
      </svg>
    ` 

      const background = await this.randInt(this.state.backgroundLength)
      const head = await this.randInt(this.state.headLength);
      const hair = await this.randInt(this.state.hairLengt);
      const eyes = await this.randInt(this.state.eyesLength);
      const nose = await this.randInt(this.state.noseLength); 
      const mouth = await this.randInt(this.state.mouthLength);
      const beard = await this.randInt(this.state.beardLength);

      var takenFaces = {};
      var face = []

      // 18,900 combinations
  
      face = [hair, eyes, mouth, nose, beard].join('');
  
      if (face[takenFaces]) {
          this.createImage();
      } else {
          //const name = this.getRandomName()
          //console.log(name)
          face = face[takenFaces];
  
          const final = template
              .replace('<!-- bg -->', await this.getLayer0(background))
              .replace('<!-- head -->', await this.getLayer1(head))
              .replace('<!-- hair -->', await this.getLayer2(hair))
              .replace('<!-- eyes -->', await this.getLayer3(eyes))
              .replace('<!-- nose -->', await this.getLayer4(nose))
              .replace('<!-- mouth -->', await this.getLayer5(mouth))
              .replace('<!-- beard -->', await this.getLayer6(beard, 0.5))
  

           console.log(final)
        
      }
  }


  constructor(props) {
    super(props)
    this.state = {
      i : null,
      input: null,
      selectedFile: null,
      year: '0',
      month: '0',
      day: '0',
      hour: '0',
      minute: '0',
      second: '0',
      name: 'undefined',
      strength: 'undefined',
      background: 'undefined',
      head: 'undefined',
      eyes: 'undefined',
      nose: 'undefined',
      mouth: 'undefined',
      hair: 'undefined',
      beard: 'undefined'
      }
  }

  render() {

    const monthsRadius = mapNumber(this.state.month, 12, 0, 0, 360);
    const daysRadius = mapNumber(this.state.day, 30, 0, 0, 360);
    const hoursRadius = mapNumber(this.state.hour, 24, 0, 0, 360);
    const minutesRadius = mapNumber(this.state.minute, 60, 0, 0, 360);
    const secondsRadius = mapNumber(this.state.second, 60, 0, 0, 360);
    return (
      <div className='text-monospace'>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <div>
            <img src={logo} className="App-logo" alt="logo" height="10"/>     
            <b className="navbar-brand" style={{float: "Middle", lineHeight: "35px"}}>NFT</b>
          </div>
          </nav>
          

          <div className="container-fluid mt-5 text-center">
              <br></br>
                <h1>Welcome to Dapps</h1>
                <br></br>
                <div className="row">
                    <main role="main" className="d-flex justify-content-center mb-3 text-black">
                        <div className="content mr-auto ml-auto">
                          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" >

                            <Tab eventKey="CountDown" title="CountDown">

                            <div>
                                <br></br>
                              Input Date and Time?
                                <form onSubmit={(e) => {
                                  e.preventDefault()
                                  let datetime = this.datetime.value
                                  
                                  this.countdown(datetime)
                                
                                }}>
                                  <div className='form-group mr-sm-2'>

                                    <label htmlFor="DateTime" style={{float: "left"}}>Date & Time:</label>
                                    <input
                                      id='DateTime'
                                      type='datetime-local'
                                      ref={(input) => { this.datetime = input }}
                                      className="form-control form-control-sm"
                                      placeholder='dd/mm/yyyy'
                                      required />   

                                  </div>
                                  <button type='submit' className='btn btn-primary'>Countdown</button>
                                </form>
                              </div>

                              <br></br>
                                <h1>Countdown until{" "} </h1>
                                <div className="countdown-wrapper">
                                    <div className="countdown-item">
                                      {this.state.year}
                                        <span>years</span>
                                    </div>
                                    <div className="countdown-item">
                                      <SVGCircle radius={monthsRadius} />
                                      {this.state.month}
                                        <span>months</span>
                                    </div>
                                    <div className="countdown-item">
                                      <SVGCircle radius={daysRadius} />
                                      {this.state.day}
                                        <span>days</span>
                                    </div>
                                  </div>

                                  <div className="countdown-wrapper">
                                    <div className="countdown-item">
                                     <SVGCircle radius={hoursRadius} />
                                      {this.state.hour}
                                        <span>hours</span>
                                    </div>
                                    <div className="countdown-item">
                                     <SVGCircle radius={minutesRadius} />
                                      {this.state.minute}
                                        <span>minutes</span>
                                    </div>
                                    <div className="countdown-item">
                                     <SVGCircle radius={secondsRadius} />
                                      {this.state.second}
                                        <span>seconds</span>
                                    </div>
                                  </div>
                            </Tab>

                            <Tab eventKey="NFT Mint" title="NFT Mint">

                            <div>

                            <form onSubmit={(e) => {
                                  e.preventDefault()
                                  let name = this.Name.value
                                  let strength = this.Strength.value
                                  this.pinata(name,strength)
                                }}>
                                  <div className='form-group mr-sm-2'>
                                  <br></br> 
                                    

                                    <label htmlFor="Name" style={{float: "left"}}>Name:</label> 
                                    <input
                                      id='Name' 
                                      type='text'
                                      ref={(input) => { this.Name = input }}
                                      className="form-control form-control-md"
                                      placeholder='Name..'
                                      required />

                                    <label htmlFor="Strength" style={{float: "left"}}>Strength:</label>
                                    <input
                                      id='Strength'
                                      step="1"
                                      type='number'
                                      ref={(input) => { this.Strength = input }}
                                      className="form-control form-control-md"
                                      placeholder='1'
                                      required />                
                                    
                                  </div>
                                  <div>
                                    <br></br>
                                        <h4>
                                          Image Upload 
                                        </h4>
                                        <div>
                                            <input type="file" onChange={this.onFileChange} />
                                        </div>
                                      {this.fileData()}
                                  </div>
                                  <button type='submit' className='btn btn-primary'>Upload</button>
                                  
                                </form>

                                  <br></br>

                              <form onSubmit={(e) => {
                                  e.preventDefault()
                                  this.pinata2()
                                }}>
                                  <div>
                                    <h5>
                                      Wait until hash updated, then press Mint : {this.state.ipfshash}
                                    </h5>   
                                    <br></br>                        
                                    <button type='submit' className='btn btn-primary'>Mint</button>
                                    <br></br>
                                    <br></br>
                                    <h5>
                                      JSON Hash : {this.state.ipfshash2}
                                    </h5>   
                                  </div>
                                  
                              </form>
                                      
                            </div>

                            </Tab>  
                            <Tab eventKey="NFT Factory" title="NFT Factory">

                              <div>  
                                <br></br>  

                                <form method="post" encType="multipart/form-data" action="#" onSubmit={(e) => {
                                  e.preventDefault()   
                                  this.generate();  
                                 
                                }}>
                                  <label htmlFor="Background" style={{float: "left"}}>Background:</label>
                                      <input
                                        id='Background' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputBackground}                                       
                                        className="form-control form-control-md"/>  

                                  <label htmlFor="Head" style={{float: "left"}}>Head:</label>
                                      <input
                                        id='Head' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputHead}
                                        className="form-control form-control-md"/>  

                                  <label htmlFor="Eyes" style={{float: "left"}}>Eyes:</label>
                                      <input
                                        id='Eyes' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputEyes}
                                        className="form-control form-control-md"/>  

                                  <label htmlFor="Nose" style={{float: "left"}}>Nose:</label>
                                      <input
                                        id='Nose' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputNose}
                                        className="form-control form-control-md"/>  

                                  <label htmlFor="Mouth" style={{float: "left"}}>Mouth:</label>
                                      <input
                                        id='Mouth' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputMouth}
                                        className="form-control form-control-md"/> 

                                  <label htmlFor="Hair" style={{float: "left"}}>Hair:</label>
                                      <input
                                        id='Hair' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputHair}
                                        className="form-control form-control-md"/> 

                                  <label htmlFor="Beard" style={{float: "left"}}>Beard:</label>
                                      <input
                                        id='Beard' 
                                        multiple directory="" 
                                        webkitdirectory="" 
                                        mozdirectory=""
                                        type='file'
                                        onChange={this.inputBeard}
                                        className="form-control form-control-md"/> 

                                  <br></br>
                                  <button type='submit' className='btn btn-primary'>Generate</button>
                                </form>

                              </div>

                            </Tab>                       

                          </Tabs>
                          </div>
                    </main>
                </div>
          </div>
      </div>
    ); 
  }
}
export default App;
