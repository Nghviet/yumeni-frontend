import axios from 'axios';

const instance = axios.create({
  headers: {
        'Content-Type': 'application/json',
    },
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.Auth;
    config.headers.Authorization =  token ? `Basic ${token}` : '';
    return config;
  });
instance.defaults.headers.common = {
          "X-API-KEY": process.env.REACT_APP_API_KEY,
        };

async function getPrefectures() {
	var result = await instance.get("https://opendata.resas-portal.go.jp/api/v1/prefectures")
	return result.data.result
}

async function getCities(prefCode) {
	var result = await instance.get("https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=" + prefCode)
	return result.data.result
}

async function getPopulationOfPrefecture(prefCode) {
	var result = await instance.get("https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=" + prefCode)
	return result.data.result.data
}

async function getPopulationOfCity(prefCode, cityCode) {
	var result = await instance.get("https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=" + prefCode + "&cityCode=" + cityCode)
	return result.data.result.data
}

export {getPrefectures, getCities, getPopulationOfPrefecture, getPopulationOfCity}