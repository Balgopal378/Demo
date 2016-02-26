  var fs = require('fs');

  fs.readFile('../agri.csv', "utf8",function (err, data) {
     if (err) {
         return console.error(err);
     }
    // console.log("Asynchronous read: " + data.toString());

    var currentLine=[];
    var headerLine=[];
    var colView=[];
    var objArrayOil=[];
    var objOil = {};
    var objArrayFoodgrains = [],commercialCropsArrayObj=[];
    var objFoodgrains = {};
    var counter=0;
    var objAggregate = {};
    var commercialCropsObj = {};
    var riceProductionObj = {};
    var riceProductionArrayObj = [];
    var result = [];
    var lookUp = ["Andhra Pradesh","AP","Karnataka","KA","Kerala","KL","Tamil Nadu","TN"];

    currentLine=data.split("\n");
    headerLine = currentLine[0].split(",");



  function createJson(paramObj, fileName){
    fs.writeFile('../../jsonFiles/'+fileName+'.json',JSON.stringify(paramObj),function(err){
      if(err){
        console.log('error while saving');
        console.log(err.message);
        return;
      }
      console.log("saved successfully");
    });
  }


  for(var j=3;j<headerLine.length;j++){
  var year=headerLine[j].trim().split("-");

  commercialCropsObj={x:year[1],y:0};
    // console.log(commercialCropsObj);
    commercialCropsArrayObj.push(commercialCropsObj);
    riceProductionObj={x:year[1],AP:0,KA:0,KL:0,TN:0};
    riceProductionArrayObj.push(riceProductionObj);
}
//console.log(commercialCropsArrayObj);
// commercial(commercialCropsArrayObj);
// riceProduction(riceProductionArrayObj);



  function commercial(){
   return commercialCropsArrayObj;
  }



  function riceProduction(){
    return riceProductionArrayObj;
  }


  var arr=commercial();
  var rice=riceProduction();


    for(var i=1;i<currentLine.length-1;i++)

      {
        colView =currentLine[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        var lenOfCol = [];
        lenOfCol = colView[0].split(" ");

          if((lenOfCol.length>4) && (lenOfCol.indexOf("Oilseeds")==2))
            {
            var temp = colView[0].slice(32);
              objOil=
              {x:temp,
                y:parseFloat(colView[23])};
                objArrayOil.push(objOil);
                // console.log(objOil);
            }
        var conditionOne = lenOfCol.indexOf("Foodgrains");
        var conditionTwo = lenOfCol.lastIndexOf("Foodgrains");
        var conditionThree=colView[0].indexOf("Agricultural Production Foodgrains");
        var conditionKharif= lenOfCol.indexOf("Kharif");
        var conditionRabi = lenOfCol.indexOf("Rabi");
          if( (lenOfCol.length>4) && (conditionThree > -1) && (conditionOne==conditionTwo))
            {
            //  console.log(colView[0]);
              if((conditionKharif > -1) || (conditionRabi > -1))
                  {
                      var temp = colView[0].substring(34);
                      objFoodgrains=
                      {x:temp,
                        y:parseFloat(colView[23])};
                      //  console.log(objFoodgrains);
                        objArrayFoodgrains.push(objFoodgrains);
                  }
            }


      /*Aggrgregate*/
      if((lenOfCol.length<=5) && (lenOfCol.indexOf("Commercial")> -1)){
        //console.log(colView[0]);
        //console.log(i);
        for(var l=3;l<headerLine.length;l++){

          if(colView[l]==='NA'){
            colView[l]=0;
          }
            arr[l-3].y=arr[l-3].y+parseFloat(colView[l]);
          }
        }


        /*Rice Production*/
  if((colView[0].indexOf("Agricultural Production Foodgrains Rice Yield")> -1) && ((colView[0].indexOf("Andhra Pradesh")> -1) || (colView[0].indexOf("Karnataka")> -1) || (colView[0].indexOf("Kerala")> -1) || (colView[0].indexOf("Tamil Nadu")> -1)))
  {
    for(var k=3;k<headerLine.length;k++){
    //  console.log(colView[4]);
    if(colView[k].trim()==='NA'){
      colView[k]=0;
    }
    //console.log(rice);
    for(var g=0;g<lookUp.length;g++)
    {
      if(colView[0].indexOf(lookUp[g])> -1){
      //  console.log(colView[k]);
        rice[k-3][lookUp[g+1]]=parseFloat(colView[k]);
      }
    }

    /*if(colView[0].indexOf("Andhra Pradesh")> -1){
      //console.log(riceProductionArrayObj);

     rice[k-3].AP=parseFloat(colView[k]);
    }

    if(colView[0].indexOf("Karnataka")> -1){
      //console.log(riceProductionArrayObj);

     rice[k-3].KA=parseFloat(colView[k]);
    }

    if(colView[0].indexOf("Kerala")> -1){
      //console.log(riceProductionArrayObj);

     rice[k-3].KL=parseFloat(colView[k]);
    }

    if(colView[0].indexOf("Tamil Nadu")> -1){
      //console.log(riceProductionArrayObj);

     rice[k-3].TN=parseFloat(colView[k]);
   }*/
  }
  }


    }
    //console.log(colView);
    //result.push(arr);
    objArrayOil.sort(function(a, b){return b.y-a.y});
    objArrayFoodgrains.sort(function(a, b){return b.y-a.y});
    //console.log(objArrayFoodgrains);
    //console.log(arr);
    //console.log(rice);
    createJson(rice,"riceProduction");
    createJson(arr,"aggrgregateCommercial");
    createJson(objArrayOil,"Oilseeds");
    createJson(objArrayFoodgrains,"Foodgrains");

  });
