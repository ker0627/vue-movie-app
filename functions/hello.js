//Netlify 에서만 가능 로컬 X

exports.handler = async function (event, context) {
  return {
    statusCode: 200,
    // body: 'Hello world!' 기본
    body: JSON.stringify({
      name: 'HEROPY',
      age: 85,
      email: 'test@gmail.com'
    })
  }
}