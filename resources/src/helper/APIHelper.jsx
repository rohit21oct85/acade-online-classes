let API_URL='';
if(process.env.REACT_APP_NODE_ENV === 'development'){
    API_URL = process.env.REACT_APP_LOCAL_API_URL;
}else{
    API_URL = process.env.REACT_APP_LIVE_API_URL;
}
export default API_URL;