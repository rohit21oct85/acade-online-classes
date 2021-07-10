export function getFilteredData(arrayData, match_field,field_value,field_name){
  if(typeof arrayData !== "undefined"){
   const filtereData = Array?.from(arrayData)?.filter(element => element[match_field] == field_value);
   if(filtereData){
     return filtereData && filtereData[0][field_name];
   }
  }
}
export function getCollectionData(arrayData, match_field,field_value){
  if(typeof arrayData !== "undefined"){
   const filtereData = Array?.from(arrayData)?.filter(element => element[match_field] == field_value);
   if(filtereData){
     return filtereData && filtereData[0];
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
export function getFirstLetter(el){
    let arr = '';
    let name = '';
    if(el.match('-')){
      arr = el.split('-');
      let data = arr?.map(e => {
        return name += e.charAt(0);
      })
      return data[data.length - 1];
    }else{
      return el.charAt(0)
    }
    
    
}

export function generateEmpId(domainName, firstName, className, section, rollNo){
  const SFL = getFirstLetter(domainName);
  const FName = firstName?.split(" ")[0];
  const class_name = className
  const section_name = section
  let roll = rollNo
  const roll_no = (roll.length < 2 ? '0'+roll: roll)
  const EmpId = `${SFL}${FName}${class_name}${section_name}${roll_no}`;
  return EmpId.toUpperCase()
}
export function generateTeacherId(domainName, firstName, subject){
    const SFL = getFirstLetter(domainName);
    let FName = '';
    const space = firstName.match(' ');
    if(space){
      FName = firstName?.split(" ")[0];
    }else{
      FName = firstName
    }
    
    let subjctSpace = subject.match('-');
    let sub = '';
    if(subjctSpace){
      sub = getFirstLetter(subject)
    }else{
      sub = subject.charAt(0);
    }
    const EmpId = `${SFL}${FName}${sub}T`;
    return EmpId.toUpperCase()
}


export function export_table_to_csv(html, filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");
  
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll("td:not(.hidden_col), th:not(.hidden_col)");
      
      for (var j = 0; j < cols.length; j++) 
          row.push(cols[j].innerText);
      
      csv.push(row.join(","));		
  }

  // Download CSV
  download_csv(csv.join("\n"), filename);
}

export function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV FILE
  csvFile = new Blob([csv], {type: "text/csv"});

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = "none";

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  // Lanzamos
  downloadLink.click();
}