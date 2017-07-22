var unitedManager = function(){
  this.subtree = true;
  this.validator = new FlightsValidator("united");
};
unitedManager.prototype.getList = function(){
  var rawList = document.getElementsByClassName("flight-block-summary-container");
  console.log("raw list");
  console.log(rawList);
  var processedList = [];
  for(var x = 0, i = rawList.length; x < i; x++){
    var aircrafts = [];
    var stops = [];
    var aircraftElement = rawList[x].getElementsByClassName('segment-aircraft-type');
    var stopElement = rawList[x].getElementsByClassName('segment-market');
    console.log("aircraftElement");
    console.log(aircraftElement);
    if(rawList[x].getElementsByClassName('non-stop')[0]){
      console.log("no stops " + x);
      aircrafts = aircraftElement.length ? this.validator.getChildNode([2], aircraftElement[0]).data.trim() : [];
    }
    else{
      console.log("multiple stops " + x);
      for(var y = 0, j = aircraftElement.length; y < j ; y++){
        aircrafts.push(this.validator.getChildNode([2], aircraftElement[y]).data.trim());
      }
      for(y = 0, j = stopElement.length - 1; y < j ; y++){
        stops.push(stopElement[y].innerText.split(" to ")[1]);
      }
    }
    processedList.push({
      depart: this.validator.getByClass("origin-airport-mismatch-code", rawList[x])[0].innerHTML,
      arrive: this.validator.getByClass("destination-airport-mismatch-code", rawList[x])[0].innerHTML,
      stops: stops,
      aircraft: "A380" //hardcoded for now
    });
  }
  console.log("--- initial list ---");
  console.log(processedList);
  this.validator.verifyList(processedList);
  return processedList;
};

unitedManager.prototype.getCoordinates = function(processedList){
  processedList = core.getCoordinates(processedList);
  console.log("--- got coordinates ---");
  console.log(processedList);
  return processedList;
};

unitedManager.prototype.getDistances = function(processedList){
    for(var x = 0, i = processedList.length; x < i; x++){
        processedList[x].distance = 0;
    console.log(processedList[x]);
      if(processedList[x].stopCoordinatesNew.length){
          noOfStops = processedList[x].stopCoordinatesNew.length;
          console.log(noOfStops);
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].stopCoordinatesNew[0].lat, processedList[x].stopCoordinatesNew[0].lon) +
              core.getDistance(processedList[x].stopCoordinatesNew[noOfStops-1].lat, processedList[x].stopCoordinatesNew[noOfStops-1].lon,
                               processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
          for(var y = 0; y < noOfStops-1 ; y++){
              console.log("Totally working fine");
              processedList[x].distance += core.getDistance(processedList[x].stopCoordinatesNew[y].lat,processedList[x].stopCoordinatesNew[y].lon,processedList[x].stopCoordinatesNew[y+1].lat,processedList[x].stopCoordinatesNew[y+1].lon);
          }
    }
    else{
      processedList[x].distance += core.getDistance(processedList[x].departCoordinates.lat, processedList[x].departCoordinates.lon,
                                                   processedList[x].arriveCoordinates.lat, processedList[x].arriveCoordinates.lon);
    }
  }
  console.log("---got distances---");
  console.log(processedList);
  return processedList;
};

unitedManager.prototype.getEmission = function(processedList){
  processedList = core.getEmission(processedList);
  console.log("---got fuel consumption---");
  console.log(processedList);
  return processedList;
};

unitedManager.prototype.insertInDom = function(processedList){
  if(processedList.length > 0){
    insertIn = this.validator.getByClass("flight-block");
    for(var x = 0, i = insertIn.length; x < i; x++){
      if (insertIn[x].getElementsByClassName('carbon').length === 0) {
        insertIn[x].appendChild(core.createMark(processedList[x].co2Emission));
      }
    }
  }
};

var FlightManager = unitedManager;
