const combos   = require("./combos");
const elements = require("./elements");
const fs = require("fs");

const writeFiles = ({comboFlag=true,elementFlag=true}={})=>{
    if(comboFlag){
        fs.writeFileSync(`${__dirname}/combos.json`,JSON.stringify(combos,null,2));
    }
    if(elementFlag) {
        fs.writeFileSync(`${__dirname}/elements.json`, JSON.stringify(elements, null, 2));
    }
};

const addElement = ({element,group})=>{
    if(!elements[group]){
        elements[group] = [];
    }
    if(elements[group].indexOf(element)===-1){
        elements[group].push(element);
    }else {
        return;
    }
    for(const group in elements){
        elements[group].forEach(d=>{
            const keys = [d,element];
            keys.sort();
            const comboKey = keys.join("|");
            combos[comboKey] = null;
        })
    }
    writeFiles();
};

const getGroup = (element)=>{
    for(const group in elements){
        if(elements[group].indexOf(element)!==-1){
            return group;
        }
    }
    return null;
};

const deleteElement = ({element})=>{
    const group = getGroup(element);
    elements[group].splice(elements[group].indexOf(element),1);
    for(const comboKey in combos){
        if(comboKey.indexOf(element)!==-1){
            delete combos[comboKey];
        }
    }
    writeFiles();
};

const addCombo = ({elem1,elem2,resElem})=>{
    const keys = [elem1,elem2];
    keys.sort();
    const comboKey = keys.join("|");
    combos[comboKey] = resElem;
    writeFiles({elementFlag:false});
};

module.exports= {
    addCombo,
    addElement,
    deleteElement
};
