import React, { Component } from 'react';
import { Variables } from '../../utils/Variables.js';
import './PhotoUpload.css';

export default class PhotoUpload extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalTitle: '',
      loadedPhoto: [],
      PhotoId: 0,
      PhotoName: '',
      PhotoFileName: 'anonymous.png',
      PhotoPath: Variables.PHOTO_URL,
      uploadedPhoto: new FormData()
    };
  }

  refreshList() {
    fetch(Variables.API_URL + 'employee/GetPhoto')
      .then((res) => res.json())
      .then((data) => {
        this.setState({ loadedPhoto: data });
        console.log(this.loadedPhoto)
      });      
  }

  componentDidMount() {
    this.refreshList();
  }
  addClick() {
    this.setState({
      modalTitle: 'Add Photo',
      PhotoId: 0,
      PhotoFileName: 'anonymous.png',
    });
  }

  createClick() {
    fetch(Variables.API_URL + 'employee/savephoto', {
      method: 'POST',
      body: this.uploadedPhoto
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //   EmployeeName: this.state.EmployeeName,
      //   PhotoFileName: this.state.PhotoFileName,
      // }),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          alert(result);
          this.refreshList();
        },
        (error) => {
          alert('Failed');
        }
      );
  }

  imageUpload = (e) => {
    e.preventDefault();

    this.uploadedPhoto.append('file', e.target.files[0], e.target.files[0].name);

    // fetch(Variables.API_URL + 'employee/savefile', {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     this.setState({ PhotoFileName: data });
    //   });
  };



  

  render() {
    const {
      loadedPhoto,
      PhotoId,
      PhotoName,
      PhotoPath,
      PhotoFileName
    } = this.state;

      console.log('-----------------')
      console.log(loadedPhoto)
      console.log('-----------------')

    function hexToBase64(str) {
      return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    var img1 = new Image();
    img1.src = "data:image/jpeg;base64,"+hexToBase64(getBinary());

    function getBinary() {
      return '111111111111111110000000000000000000011111111111110000000000001110000000000011111110000000000000111110000010000000001000000000000000001100000000000100100010000000000000000000011111000000010011000000000000000000000001101000000001000000000000000000000000000101100001100000000000000000000000000000001110010000000000000010000000000000000000110000000000000000001001000000000000000010001100000000000000100100000000000000001001001100000000000001100000000000000000000111110001001110000011000000000000000000011100110000000000000100000000000000000110001000000000000000000000000000000000011100000110000000000000000000000000000000000011111010000000000000000001000000000001111111100000000000000000010000000000001111111111010000000000000000101000000000111111011100001001000000010010000000000011111111110000111101100000000000000000000110110110110010110100000000000000000000000111101111001100011000000000000000000000000111111000111111110000000000000000000000000001100000111100000000000000000000000000000010000001111000000000000000000000000000000110000000010000000000000000000000000000000110000111'
      
    }

    
    return (
      <div className='maincontainer'>
        <button
          type='button'
          className='btn btn-primary m-2 float-start'
          data-bs-toggle='modal'
          data-bs-target='#exampleModal'
          onClick={() => this.addClick()}
        >
          Upload Photo
        </button>
        <img src={img1.src} alt="Girl in a jacket" width="200" height="200" />
        <div
          className='modal fade'
          id='exampleModal'
          tabIndex='-1'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-lg modal-dialog-centered'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>modaltitle</h5>
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
                  <div className='p-2 w-50 bd-highlight'>
                    <img
                      width='250px'
                      height='250px'
                      src={PhotoPath + PhotoFileName}
                    />
                    <input
                      className='m-2'
                      type='file'
                      onChange={this.imageUpload}
                    />
                  </div>

                  <button
                    type='button'
                    className='btn btn-primary float-start'
                    onClick={() => this.createClick()}
                  >
                    Create
                  </button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
