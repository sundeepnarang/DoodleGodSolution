const elements = require("./initElements");
const fs = require("fs");

const allElemsArray = Object.keys(elements).reduce((a,b)=>{
    return a.concat(elements[b]);
},[]);


const combos = {};

for(let i =0;i<allElemsArray.length;i++){
    for(let j = i;j<allElemsArray.length;j++){
        if(!combos[allElemsArray[i]]){
            combos[allElemsArray[i]] = {};
        }
        combos[allElemsArray[i]][allElemsArray[j]] = null;
    }
}

fs.writeFile(`${__dirname}/combos.json`,JSON.stringify(combos,null,2),(err)=>{
    if(err){
        return console.log("Error writing json :" ,err);
    }
    console.log("Fin");
});