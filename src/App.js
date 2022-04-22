import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap';
import React, {Component } from "react";
import './App.css';
import { Canvg } from 'https://cdn.skypack.dev/canvg';


function svgToPng(svg, callback) {
  const url = getSvgUrl(svg);
  svgUrlToPng(url, (imgData) => {
    callback(imgData);
    URL.revokeObjectURL(url);
  });
}
function getSvgUrl(svg) {
  return URL.createObjectURL(new Blob([svg], {
    type: 'image/svg+xml'
  }));
}
function svgUrlToPng(svgUrl, callback) {
  const svgImage = document.createElement('img');
  document.body.appendChild(svgImage);
  svgImage.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = svgImage.clientWidth;
    canvas.height = svgImage.clientHeight;
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.drawImage(svgImage, 0, 0);
    const imgData = canvas.toDataURL('image/png');
    callback(imgData);
  };
  svgImage.src = svgUrl;
}

function timeout(delay) {
  return new Promise( res => setTimeout(res, delay) );
}

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

    let reader = new FileReader();
    reader.onload = (e) => {
      this.setState({image: e.target.result});
    };
    reader.readAsDataURL(event.target.files[0]);
    console.log(this.state.abc)

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
    //console.log(background[0])
  };

  inputHead = event => {
    var head = [];
    const headLength = event.target.files.length;
    this.setState({headLength});

    for (var i = 0; i < event.target.files.length; i++){
      head[i] = event.target.files[i];

      this.setState({head});
    }
    //console.log(head[0])
  };

  inputEyes = event => {
    var eyes = [];
    const eyesLength = event.target.files.length;
    this.setState({eyesLength});

    for (var i = 0; i < event.target.files.length; i++){
      eyes[i] = event.target.files[i];

      this.setState({eyes});
    }
    //console.log(eyes[0])
  };

  inputNose = event => {
    var nose = [];
    const noseLength = event.target.files.length;
    this.setState({noseLength});

    for (var i = 0; i < event.target.files.length; i++){
      nose[i] = event.target.files[i];

      this.setState({nose});
    }
    //console.log(nose[0])
  };

  inputMouth = event => {
    var mouth = [];
    const mouthLength = event.target.files.length;
    this.setState({mouthLength});

    for (var i = 0; i < event.target.files.length; i++){
      mouth[i] = event.target.files[i];

      this.setState({mouth});
    }
    //console.log(mouth[0])
  };

  inputHair = event => {
    var hair = [];
    const hairLength = event.target.files.length;
    this.setState({hairLength});

    for (var i = 0; i < event.target.files.length; i++){
      hair[i] = event.target.files[i];

      this.setState({hair});
    }
    //console.log(hair[0])
  };

  inputBeard = event => {
    var beard = [];
    const beardLength = event.target.files.length;
    this.setState({beardLength});

    for (var i = 0; i < event.target.files.length; i++){
      beard[i] = event.target.files[i];

      this.setState({beard});
    }
    //console.log(beard[0])
  };

  async generate(){  

    //const max = 0;
    //const arr = {};
    let idx = 19;

    do {
      await this.createImage(idx);
      await timeout(200); //for 0.2 sec delay
      idx--;
    } while (idx >= 0);
  }

  async randInt(max ) {
    return Math.floor(Math.random() * (max));
  }

  async randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  async getRandomName() {
    const takenNames = {};
        const adjectives = 'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(' ');
        const names = 'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(' ');
        
        const randAdj = await this.randElement(adjectives);
        const randName = await this.randElement(names);
        const name = `${randAdj}-${randName}`;


        if (takenNames[name] || !name) {
            return this.getRandomName();
        } else {
            takenNames[name] = name;
            return name;
        }
  }

  async getLayer0(backgroundnum, skip=0.0) {

    const data0 = this.state.background[backgroundnum]; 

    const reader = new FileReader();
    reader.readAsText(data0);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer0 = svg.match(re)[0];
      this.setState({layer0});
    };

    return Math.random() > skip ? this.state.layer0 : '';
  }

  async getLayer1(headnum, skip=0.0) {

    const data1 = this.state.head[headnum]; 
    const reader = new FileReader();
    reader.readAsText(data1);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer1 = svg.match(re)[0];
      this.setState({layer1});
    };
    return Math.random() > skip ? this.state.layer1 : '';
  }

  async getLayer2(eyesnum, skip=0.0) {

    const data2 = this.state.eyes[eyesnum];
    const reader = new FileReader();
    reader.readAsText(data2);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer2 = svg.match(re)[0];
      this.setState({layer2});
    };
    return Math.random() > skip ? this.state.layer2 : '';
  }

  async getLayer3(nosenum, skip=0.0) {

    const data3 = this.state.nose[nosenum];
    const reader = new FileReader();
    reader.readAsText(data3);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer3 = svg.match(re)[0];
      this.setState({layer3});
    };
    return Math.random() > skip ? this.state.layer3 : '';
  }

  async getLayer4(mouthnum, skip=0.0) {

    const data4 = this.state.mouth[mouthnum];
    const reader = new FileReader();
    reader.readAsText(data4);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer4 = svg.match(re)[0];
      this.setState({layer4});
    };
    return Math.random() > skip ? this.state.layer4 : '';
  }

  async getLayer5(hairnum, skip=0.0) {

    const data5 = this.state.hair[hairnum];
    const reader = new FileReader();
    reader.readAsText(data5);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer5 = svg.match(re)[0];
      this.setState({layer5});
    };
    return Math.random() > skip ? this.state.layer5 : '';
  }

  async getLayer6(beardnum, skip=0.0) {

    const data6 = this.state.beard[beardnum]; 
    const reader = new FileReader();
    reader.readAsText(data6);
    reader.onload = (e) => {
      const svg = reader.result;
      const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
      const layer6 = svg.match(re)[0];
      this.setState({layer6});
    };
    return Math.random() > skip ? this.state.layer6 : '';
  }
  
  async createImage(idx) {

    const template = `
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
          <bg/>
          <head/>
          <eyes/>
          <nose/>
          <mouth/>
          <hair/>
          <beard/>
      </svg>
    ` 

    const backgroundResult = await this.getLayer0(await this.randInt(this.state.backgroundLength));
    const headResult = await this.getLayer1(await this.randInt(this.state.headLength));
    const eyesResult =  await this.getLayer2(await this.randInt(this.state.eyesLength));
    const noseResult =  await this.getLayer3(await this.randInt(this.state.noseLength));
    const mouthResult = await this.getLayer4(await this.randInt(this.state.mouthLength));
    const hairResult = await this.getLayer5(await this.randInt(this.state.hairLength));
    const beardResult = await this.getLayer6(await this.randInt(this.state.beardLength));

    var takenFaces = {};

    // 18,900 combinations
  
    var face = [eyesResult, noseResult, mouthResult, hairResult, beardResult].join('');
  
    if (face[takenFaces]) {
      this.createImage();
    } else {
      const name = await this.getRandomName()
      //console.log(name)
      face = face[takenFaces];
  
      const final = template
        .replace('<bg/>', backgroundResult)
        .replace('<head/>', headResult)
        .replace('<eyes/>', eyesResult)     
        .replace('<nose/>', noseResult)
        .replace('<mouth/>', mouthResult)
        .replace('<hair/>', hairResult)
        .replace('<beard/>', beardResult)
  
      //console.log(final)

      const meta = {
        name,
        description: `A drawing of ${name.split('-').join(' ')}`,
        image: `${idx}.svg`,
        attributes: [
          { 
            beard: '',
            rarity: 0.5
          }
        ]
      }

      await this.downloadFile(`${idx}.json`, JSON.stringify(meta))
      await this.downloadFile(`${idx}.png`, final)

      svgToPng(final, (imgData) => {
        const pngImage = document.createElement('img');
        document.body.appendChild(pngImage);
        pngImage.src = imgData;
      });
      
      }
  }

 async downloadFile(name, file) {
    var link = document.createElement("a");
    var blob = new Blob([file], {type: 'image/svg+xml'});
    var url  = window.URL.createObjectURL(blob);
    link.setAttribute('download', name);
    link.setAttribute('href', url);
    link.click();
    console.log('succeed')
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
      layer0: 'undefined',
      layer1: 'undefined',
      layer2: 'undefined',
      layer3: 'undefined',
      layer4: 'undefined',
      layer5: 'undefined',
      layer6: 'undefined',
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
                                        <img id="target" src={this.state.image}/>
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
