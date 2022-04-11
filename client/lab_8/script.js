function getRandomIntInclusive(min, max) {
    const newMin = Math.ceil(min);
    const newMax = Math.floor(max);
    return Math.floor(
      Math.random() * (newMax - newMin + 1) + newMin
    );
  }
  function dataHandler(dataArray) {
    // console.table(dataArray.data); // this is called "dot notation"
    const range = [...Array(15).keys()];
    const listItems = range.map((item, index) => {
      const restNum = getRandomIntInclusive(0, dataArray.length - 1);
      return dataArray[restNum];
    });
    return listItems;
    // range.forEach((item) => {
    //  console.log('range item', item);
    // });
  }
  
  function initMap(targetId) {
      const latLong = [38.784, -76.872];
      const map = L.map('map').setView(latLong, 13);
      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
    }).addTo(map);
    return map;
  }

  function addMapMarkers(map, collection) {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
          layer.remove();
      }
    });

    collection.forEach((item) => {
        const point = item.geocoded_column_1?.coordinates;
        console.log(item.geocoded_column_1?.coordinates);
        L.marker([point[1], point[0]]).addTo(map);
    });
  }

  function createHtmlList(collection) {
    const targetList = document.querySelector('.resto-list');
    targetList.innerHTML = '';
    collection.forEach((item) => {
      const {name} = item;
      const displayName = name.toLowerCase();
      const injectThisItem = `<li>${displayName}</li>`;
      targetList.innerHTML += injectThisItem;
    });
  }
  // As the last step of your lab, hook this up to index.html
  
  async function mainEvent() { // the async keyword means we can make API requests
    const form = document.querySelector('.main_form');
    const submit = document.querySelector('.submit');
    
    const resto = document.querySelector('#resto_name');
    const zipcode = document.querySelector('#zipcode');
    const map = initMap('map');
    const retrievalVar = 'restaurants';
    submit.style.display = 'none';
    
    if (localStorage.getItem(retrievalVar) === undefined) {
    const results = await fetch('/api/foodServicesPG'); // This accesses some data from our API
    const arrayFromJson = await results.json(); // This changes it into data we can use - an object
    console.log(arrayFromJson);
    localStorage.setItem(retrievalVar, JSON.stringify(arrayFromJson.data));
    }

    const storedDataString = localStorage.getItem(retrievalVar);
    const storedDataArray = JSON.parse(storedDataString);
    console.log(storedData);
    //let arrayFromJson = {data : []}; // TODO: Remove debug tool

    if (storedDataArray.length > 0) { // This if statement is to prevent a race condition on data load
      submit.style.display = 'block';
      
      let currentArray = [];
      resto.addEventListener('input', async (event) => {
        console.log(event.target.value);

        if (currentArray.length < 1) {
          // console.log('empty');
          return;
        }

        const selectResto = storedDataArray.filter((item) => {
          const lowerName = item.name.toLowerCase();
          const lowerValue = event.target.value.toLowerCase();
          return lowerName.includes(lowerValue);
        });
        
        console.log(selectResto);
        createHtmlList(selectResto);
      });

      // Zipcode
      zipcode.addEventListener('input', async (event) => {
        console.log(event.target.value);

        if (currentArray.length < 1) {
          // console.log('empty');
          return;
        }
        const selectNum = currentArray.filter((item) => {
          const lowerName = item.zip.toLowerCase();
          const lowerValue = event.target.value.toLowerCase();
          return lowerName.includes(lowerValue);
        });
        createHtmlList(selectNum);
      });

      form.addEventListener('submit', async (submitEvent) => { // async has to be declared all the way to get an await
        submitEvent.preventDefault(); // This prevents your page from refreshing!
        //console.log('form submission'); // this is substituting for a "breakpoint"
        
        currentArray = dataHandler(storedDataArray);
        createHtmlList(currentArray);
        addMapMarkers(map, currentArray);
      // arrayFromJson.data - we're accessing a key called 'data' on the returned object
      // it contains all 1,000 records we need
      });
    }
  }
  
  // this actually runs first! It's calling the function above
  document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests