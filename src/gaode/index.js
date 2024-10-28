import { useState, useEffect } from "react";
import AMapLoader from '@amap/amap-jsapi-loader'
import { key, securityJsCode } from '../config'

function useGaode() {
  const [AMap, setAMap] = useState(null)

  useEffect(() => {
    window._AMapSecurityConfig = {
      securityJsCode
    }
    AMapLoader.load({
      key
    }).then(AMap => {
      setAMap(AMap)
    })
  })

  return AMap
}

export default useGaode