const { JSDOM } = require('jsdom')

async function crawlPage(currentURL){
  console.log(`actively crawling: ${currentURL}`)

  try {
    const response = await fetch(currentURL)

    if (response.status > 399){
      console.log(`error in fetch with status: ${response.status} on page ${currentURL}`)
      return
    }

    const contentType = response.headers.get("content-type")
    if (!contentType.includes("text/html")){
      console.log(`non html response, content type: ${contentType} on page ${currentURL}`)
      return
    }

    console.log(await response.text())
  } catch (err){
    console.log(`error in fetch: ${err.message}, on page: ${currentURL}`)
  }
  
}

function getURLsFromHTML(htmlBody, baseURL){
  const urls = []
  const dom = new JSDOM(htmlBody)
  const aElements = dom.window.document.querySelectorAll('a')
  for (const aElement of aElements){
    if (aElement.href.slice(0,1) === '/'){
      try {
        urls.push(new URL(aElement.href, baseURL).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    } else {
      try {
        urls.push(new URL(aElement.href).href)
      } catch (err){
        console.log(`${err.message}: ${aElement.href}`)
      }
    }
  }
  return urls
}

function normalizeURL(url){
  const urlObj = new URL(url)
  let fullPath = `${urlObj.host}${urlObj.pathname}`
  if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
    fullPath = fullPath.slice(0, -1)
  }
  return fullPath
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage
}