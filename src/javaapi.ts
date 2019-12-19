import axios from 'axios';

export interface javaData {
 data:any
}

const apiClient = axios.create({
  baseURL: '/',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
});


function gup( name:string ) {
  const url = document.location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

export const getScenarioData = async(name:string) => {

  try {
    let url ='/loadmap/?name='+name;

    const response = await apiClient.get<any>(url);
    const data = response.data;

    return data;
  } catch (err) {
    if (err && err.response) {
      return err.response;
    }
    throw err;
  }
};


export const sendMyName = async(name:string) => {

  try {
    let url ='/my_name_is/?name='+name;

    const response = await apiClient.get<any>(url);
    const data = response.data;

    return data;
  } catch (err) {
    if (err && err.response) {
      return err.response;
    }
    throw err;
  }
};