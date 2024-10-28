import { useEffect, useState } from 'react';
import './App.css';
import { Select, message, Spin, Descriptions } from 'antd';
import _debounce from 'lodash.debounce';
import _uniqby from 'lodash.uniqby';
import _find from 'lodash.find';
import dayjs from 'dayjs';
import useGaode from './gaode';
import { fetchWeather } from './apis';

message.config({
  maxCount: 1,
});

function App() {
  const AMap = useGaode();

  const [searchText, setSearchText] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (searchText) confirmLngLat(searchText);
  }, [searchText]);

  /**
   * 获取下拉选项
   */
  const getOptions = text => {
    const getAddress = () => {
      AMap.plugin('AMap.Geocoder', function () {
        const geocoder = new AMap.Geocoder({});
        geocoder.getLocation(text, function (status, result) {
          console.log('result >>>', result);
          if (!(status === 'complete' || result.info === 'OK')) {
            return message.warning('未获得经纬度');
          }
          if (result.geocodes.length === 0) {
            return message.warning('未获得经纬度');
          }
          setOptions(_uniqby(result.geocodes, 'formattedAddress'));
        });
      });
    };

    if (text) {
      getAddress();
    } else {
      setOptions([]);
    }
  };

  /**
   * 从地址查询到Lng、Lat
   */
  const confirmLngLat = async text => {
    const opt = _find(options, ({ formattedAddress }) => formattedAddress === text);
    if (!opt) {
      return message.info('未获得经纬度');
    }

    const {
      location: { lng, lat },
    } = opt;
    console.log({ lng, lat });

    setLoading(true);
    try {
      const res = await fetchWeather({ lng, lat });
      console.log('fetchWeather res >>>', res);
      if (res.data.cod === 200) {
        setData(res.data);
      } else {
        message.error('获取天气信息失败，请稍后重试');
        setData(null);
      }
      setLoading(false);
    } catch (error) {
      message.error(error);
      setData(null);
      setLoading(false);
    }
  };

  return (
    <div id='container'>
      <h3>天气查询</h3>
      <div className='form-container'>
        <Select
          showSearch
          allowClear
          size='large'
          value={searchText}
          placeholder='请输入要查询的地址'
          defaultActiveFirstOption={false}
          suffixIcon={null}
          filterOption={false}
          notFoundContent={null}
          onChange={setSearchText}
          onSearch={_debounce(getOptions, 500)}
          options={options.map(opt => ({
            value: opt.formattedAddress,
            label: opt.formattedAddress,
          }))}
          style={{ width: 400 }}
        />
      </div>
      <div className='content'>
        {loading ? (
          <Spin />
        ) : (
          data && (
            <Descriptions title={data.name}>
              <Descriptions.Item label='Location'>{`lat: ${data.coord.lat} lng: ${data.coord.lon}`}</Descriptions.Item>
              <Descriptions.Item label='Main.feels_like'>{data.main.feels_like}</Descriptions.Item>
              <Descriptions.Item label='Main.grnd_level'>{data.main.grnd_level}</Descriptions.Item>
              <Descriptions.Item label='Main.humidity'>{data.main.humidity}</Descriptions.Item>
              <Descriptions.Item label='Main.pressure'>{data.main.pressure}</Descriptions.Item>
              <Descriptions.Item label='Main.sea_level'>{data.main.sea_level}</Descriptions.Item>
              <Descriptions.Item label='Main.temp'>{data.main.temp}</Descriptions.Item>
              <Descriptions.Item label='Main.temp_max'>{data.main.temp_max}</Descriptions.Item>
              <Descriptions.Item label='Main.temp_min'>{data.main.temp_min}</Descriptions.Item>
              <Descriptions.Item label='sys.sunrise'>
                {dayjs(data.sys.sunrise).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label='sys.sunset'>
                {dayjs(data.sys.sunset).format('YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label='wind.deg'>{data.wind.deg}</Descriptions.Item>
              <Descriptions.Item label='wind.speed'>{data.wind.speed}</Descriptions.Item>
            </Descriptions>
          )
        )}
      </div>
    </div>
  );
}

export default App;
