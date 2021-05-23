/*

[task local]
0 7 * * * https://raw.githubusercontent.com/sngxpro/scripts/main/snjc/snjc.js, tag=酸奶机场签到, img-url=https://raw.githubusercontent.com/sngxpro/icons/main/genshin/lisha.png, enabled=true

[rewrite local]
^https://shyni.xyz/user/checkin url script-request-header https://raw.githubusercontent.com/sngxpro/scripts/main/snjc/jc.cookie.js

[mitm]
hostname = shyni.xyz

使用方法：开启配置后，登录酸奶机场，签到一次，即可获取cookie。未配置boxjs暂时。



*/



const cookieName = '酸奶机场'
const signurlKey = 'sngxpro_cookie_snjc'
const signheaderKey = 'sngxpro_signheader_snjc'
const signbodyKey = 'sngxpro_signbody_snjc'
const sngxpro = init()
const signurlVal = sngxpro.getdata(signurlKey)
const signheaderVal = sngxpro.getdata(signheaderKey)


sign()

function sign() {

  const url = { url: signurlVal, headers: JSON.parse(signheaderVal)}
  sngxpro.post(url, (error, response, data) => {
    const result = JSON.parse(data)
    let subTitle = ``
    let detail = ``
    const status = result.ret
	    
    if (status == 1) {
	  subTitle = `签到结果: 成功`
      detail = `此次签到奖励: ${result.msg}, 总流量: ${result.traffic}, 今日已使用: ${result.trafficInfo.todayUsedTraffic}, 近期累计使用: ${result.trafficInfo.lastUsedTraffic}, 剩余流量: ${result.trafficInfo.unUsedTraffic}`
    } else if (status == 0) {
      subTitle = `签到结果: 重复`
      detail = '愚蠢的人类呦，你今天已经来过了呀！'
    }else {
      subTitle = `签到结果: 失败`
      detail = '可恶，到底发生了什么？我不明白…'
      }
    sngxpro.msg(cookieName, subTitle, detail)
    sngxpro.log(cookieName)
    sngxpro.log(subTitle)
    sngxpro.log(detail)
    sngxpro.done()
  })
}


function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(key, val)
    if (isQuanX()) return $prefs.setValueForKey(key, val)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
