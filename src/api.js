// mock API to test with

const HTTP_BAD_GATEWAY = 502
const HTTP_GATEWAY_TIMEOUT = 504

async function pollCamera (
  url, timeout = 10000, instant = false, canFail = true, canTimeout = true
) {
  const id = parseInt(url.trim('/').split('/').pop(), 10)
  const connected = Math.random() > 0.1

  if (!canFail || connected) {
    const responseTime = instant ? 0 : Math.random() * 11000
    if (!canTimeout || responseTime < timeout) {
      // response will succeed
      return new Promise(wait.bind(null, dataResponse, responseTime, id))
    } else {
      // response will time out
      return new Promise(wait.bind(null, timeoutResponse, timeout, null))
    }
  } else {
    // camera not available
    return HTTP_BAD_GATEWAY
  }
}

function wait (fn, timeout, data, resolve) {
  setTimeout(fn.bind(null, resolve, data), timeout)
}

function timeoutResponse (resolve) {
  resolve(HTTP_GATEWAY_TIMEOUT)
}

async function dataResponse (resolve, id) {
  const imageCount = Math.floor(Math.pow(Math.random() * 2 + 1, Math.random() * 4 + 1))

  let images = new Array(imageCount)
  for (let i = 0; i < imageCount; i++) {
    images[i] = { file_size: Math.floor(Math.random() * 999 + 1) * 64 }
  }
  let response = {
    camera_id: id,
    images: images
  }

  resolve(response)
}

export default pollCamera
