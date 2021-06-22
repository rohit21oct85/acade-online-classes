export function getFilteredData(arrayData, match_field,field_value,field_name){
  if(typeof arrayData !== "undefined"){
   const filtereData = Array?.from(arrayData)?.filter(element => element[match_field] == field_value);
   if(filtereData){
     return filtereData && filtereData[0][field_name];
   }
  }
}

export function checkExists(arr = [], field, el){
  if(typeof arr !== "undefined") {
    return Array.from(arr)?.some(elem => elem[field] === el);
  }
}

export function romanize(num) {
      var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
          roman = '',
          i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
}

export function getMethodName(method){
  return method.split('-')[0];
}
export function getDateValue(el){
  return el.split('T')[0];
}
