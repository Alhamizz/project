import logo from './logo.svg';
import { Tabs, Tab } from 'react-bootstrap';
import React, {Component } from "react";
import './App.css';

class App extends Component {

  async countdown(years, months, days, hours, minutes, seconds){
    this.setState({ years, months, days, hours, minutes, seconds});

    this.interval = setInterval(() => { 
      
      var date1 = new Date();
      var date2 = new Date(this.state.years, this.state.months, this.state.days, this.state.hours, this.state.minutes, this.state.seconds);
      const diff = new Date(date2.getTime() - date1.getTime());

      var year = diff.getUTCFullYear() - 1970;
      var month = diff.getUTCMonth();
      var day = diff.getUTCDate() - 1;
      var hour = diff.getUTCHours();
      var minute = diff.getUTCMinutes();
      var second = diff.getUTCSeconds();

      if (diff < 0){
        year = 0;
        month = 0;
        day = 0;
        hour = 0;
        minute = 0;
        second = 0;
      }
   
      this.setState({ year, month, day, hour, minute, second});
      //console.log(diff.getUTCDate())
      //console.log(date1.getUTCDate())

    }, 1000);
  }

  
  
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

  //IMAGEUPLOAD
    // On file select (from the pop up)
    onFileChange = event => {
        
      // Update the state
      this.setState({ selectedFile: event.target.files[0] });

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

    

  constructor(props) {
    super(props)
    this.state = {

      selectedFile: null,
      year: '0',
      month: '0',
      day: '0',
      hour: '0',
      minute: '0',
      second: '0',
      name: 'undefined',
      strength: 'undefined'
      }
  }

  render() {
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
                                  let years = this.years.value
                                  let months = this.months.value - 1
                                  let days = this.days.value
                                  let hours = this.hours.value 
                                  let minutes = this.minutes.value
                                  let seconds = this.seconds.value
                                  
                                  this.countdown(years, months, days, hours, minutes, seconds)
                                
                                }}>
                                  <div className='form-group mr-sm-2'>

                                    <label htmlFor="Year" style={{float: "left"}}>Year:</label>
                                    <input
                                      id='Year'
                                      type='number'
                                      ref={(input) => { this.years = input }}
                                      className="form-control form-control-sm"
                                      placeholder='2000..'
                                      required />

                                    <label htmlFor="Month" style={{float: "left"}}>Month (1-12):</label>
                                    <input
                                      id='Month'
                                      type='number'
                                      ref={(input) => { this.months = input }}
                                      className="form-control form-control-sm"
                                      placeholder='1-12..'
                                      min="1" 
                                      max="12"
                                      required />

                                    <label htmlFor="Day" style={{float: "left"}}>Day (1-31):</label>
                                    <input
                                      id='Day'
                                      type='number'
                                      ref={(input) => { this.days = input }}
                                      className="form-control form-control-sm"
                                      placeholder='1-31..'
                                      min="1" 
                                      max="31"
                                      required />

                                    <label htmlFor="Hour" style={{float: "left"}}>Hour (0-23):</label>
                                    <input
                                      id='Hour'
                                      type='number'
                                      ref={(input) => { this.hours = input }}
                                      className="form-control form-control-sm"
                                      placeholder='0-23..'
                                      min="0" 
                                      max="23"
                                      required />
                                      
                                    <label htmlFor="Minute" style={{float: "left"}}>Minute (0-59)</label>
                                    <input
                                      id='Minute'
                                      type='number'
                                      ref={(input) => { this.minutes = input }}
                                      className="form-control form-control-sm"
                                      placeholder='0-59..'
                                      min="0" 
                                      max="59"
                                      required />

                                    <label htmlFor="Second" style={{float: "left"}}>Second (0-59):</label>
                                    <input
                                      id='Second'
                                      type='number'
                                      ref={(input) => { this.seconds = input }}
                                      className="form-control form-control-sm"
                                      placeholder='0-59..'
                                      min="0" 
                                      max="59"
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
                                      {this.state.month}
                                        <span>months</span>
                                    </div>
                                    <div className="countdown-item">
                                      {this.state.day}
                                        <span>days</span>
                                    </div>
                                  </div>

                                  <div className="countdown-wrapper">
                                    <div className="countdown-item">
                                      {this.state.hour}
                                        <span>hours</span>
                                    </div>
                                    <div className="countdown-item">
                                      {this.state.minute}
                                        <span>minutes</span>
                                    </div>
                                    <div className="countdown-item">
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