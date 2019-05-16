//jshint esversion:8

class UI {
  constructor() {
    this.output = document.querySelector('#output');
    this.form = document.querySelector('#form');
  }

  showHouse(house) {
    let output = '';
    if (house.msg === undefined) {
      output = `
      <h5>ID: ${house._id}</h5>
      <p>Address: ${house.address}</p>
      <p>company: ${house.company}</p>
      <br>
      `;
    } else {
      output = `
    <h5>${house.msg}</h5>
    `;
    }
    this.output.innerHTML = output;
  }

  showAllHouses(houses) {
    this.clear();
    let output = '';
    houses.forEach(house => {
      output += `
      <h5>ID: ${house._id}</h5>
      <p>Address: ${house.address}</p>
      <p>company: ${house.company}</p>
      <br>
      `;
    });
    this.output.innerHTML = output;
  }

  showMeters(meters) {
    let output = '';
    if (meters.msg === undefined) {
      meters.forEach(meter => {
        output += `
          <h5>ID: ${meter._id}</h5>
          <p>Factory Number: ${meter.factoryNumber}</p>
          <p>Indication: ${meter.indication}</p>
          <p>House: ${meter.house.address}</p>
          <br>
        `;
      });
    } else {
      output = `
        <h5>${meters.msg}</h5>
      `;
    }
    this.output.innerHTML = output;
  }

  showMostLeast(house) {
    this.clear();
    let output = `
      <h5>ID: ${house[0]._id}</h5>
      <p>Total consumption: ${house[0].indication}</p>
      <br>
    `;
    this.output.innerHTML = output;
  }

  showForm(action) {
    this.clear();
    let form = '';
    if (action === 'Delete' || action === 'Find' || action === 'Find Meters') {
      form = `
          <div class="form-group">
            <label for="houseID">House ID:</label>
            <input type="text" class="form-control" id="houseID" placeholder="Enter House ID">
          </div>
          <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
        `;
    } else if (action === 'Add House') {
      form = `
        <div class="form-group">
          <label for="houseAddress">House Address:</label>
          <input type="text" class="form-control mb-2" id="houseAddress" placeholder="Enter House Address">
          <label for="houseCompany">House Company:</label>
          <input type="text" class="form-control" id="houseCompany" placeholder="Enter House Company">
        </div>
        <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
      `;
    } else if (action === 'Create Meter') {
      form = `
        <div class="form-group">
          <label for="houseId">House ID(optional):</label>
          <input type="text" class="form-control mb-2" id="houseId" placeholder="Enter House ID">
          <label for="meterFactoryNumber">Meter Factory Number:</label>
          <input type="text" class="form-control mb-2" id="meterFactoryNumber" placeholder="Enter Meter Factory Number">
          <label for="meterIndication">Meter Indication:</label>
          <input type="text" class="form-control" id="meterIndication" placeholder="Enter Meter Indication">
        </div>
        <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
      `;
    } else if (action === 'Edit House'){
      form = `
        <div class="form-group">
          <label for="houseId">House ID:</label>
          <input type="text" class="form-control mb-2" id="houseId" placeholder="Enter House ID, that you want to change">
          <label for="houseAddress">House address:</label>
          <input type="text" class="form-control mb-2" id="houseAddress" placeholder="Enter new Address">
          <label for="houseCompany">House Company:</label>
          <input type="text" class="form-control" id="houseCompany" placeholder="Enter new Company">
        </div>
        <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
      `;
    } else if(action === 'Enter new Indication'){
      form = `
        <div class="form-group">
          <label for="meterID">Meter ID:</label>
          <input type="text" class="form-control mb-2" id="meterID" placeholder="Enter Meter ID">
          <label for="meterIndication">Meter Indication:</label>
          <input type="text" class="form-control" id="meterIndication" placeholder="Enter New indication">
        </div>
        <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
      `;
    } else if(action === 'Register'){
      form = `
        <div class="form-group">
          <label for="meterID">Meter ID:</label>
          <input type="text" class="form-control mb-2" id="meterID" placeholder="Enter Meter ID">
          <label for="houseID">House ID:</label>
          <input type="text" class="form-control" id="houseID" placeholder="Enter House ID">
        </div>
        <button type="submit" class="btn btn-primary mb-4 input" id=${action.replace(/\s+/g, '')}>${action}</button>
      `;
    }
    this.form.innerHTML = form;
  }

  clear() {
    this.form.innerHTML = '';
    this.output.innerHTML = '';
  }
}
