//jshint esversion:8

class Danfoss{
  //Make an HTTP GET request
  get(url){
    return new Promise((resolve, reject) => {
      fetch(url)
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  //Make an HTTP DELETE request
  delete(url){
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  }

  //Make an HTTP POST request
  post(url, data){
    return new Promise((resolve,reject) =>{
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    });
  }

  //Make an HTTP LINK request
  link(url, data){
    return new Promise((resolve,reject) =>{
      fetch(url, {
        method: 'LINK',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    });
  }

  //Make an HTTP PATCH request
  patch(url, data){
    return new Promise((resolve, reject) =>{
      fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err));
    });
  }

  //Validate data for PATCH
  validate(data){
    let output = {};
    data.forEach((e, i) => {
      if(e !== ''){
        if(i === 0){
          output.houseID = e;
        }
        if(i === 1){
          output.address = e;
        }
        if(i === 2){
          output.company = e;
        }
      }
    });
    return output;
  }
}
