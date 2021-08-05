const sdk = require('matrix-js-sdk')
const uuidv4 = require('uuid').v4

const DEFAULT_PASSWORD = 'tCDMiELuphq5Dr'

export const registerMatrixUser = async () => {
  console.log('start registration')
  const client = await sdk.createClient({
    baseUrl: process.env.MATRIX_HOMESERVER,
  })
  const username = `terarakrya_${uuidv4()}`
  console.log(`username`, username)
  try {
    await client.registerRequest({})
  } catch (error) {
    try {
      const matrixUser = await client.registerRequest({
        username,
        password: DEFAULT_PASSWORD,
        inhibit_login: false,
        auth: {
          type: 'm.login.dummy',
          session: error.session,
        },
      })

      if (matrixUser && matrixUser.user_id && matrixUser.access_token) {
        return matrixUser
      } else {
        throw new Error(
          'Missing fields from matrix registration response!',
          matrixUser
        )
      }
    } catch (e) {
      console.log('e', e)
      throw e
    }
  }
}
