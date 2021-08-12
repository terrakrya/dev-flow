const sdk = require('matrix-js-sdk')
const uuidv4 = require('uuid').v4

const DEFAULT_PASSWORD = 'tCDMiELuphq5Dr'

export const registerMatrixUser = async () => {
  const username = `terrakrya_${uuidv4()}`
  console.log(`<<< Start Registration ${username} >>>`)

  const client = await sdk.createClient({
    baseUrl: process.env.MATRIX_HOMESERVER,
  })
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

export const createRoom = async ({ name, topic }) => {
  const roomAlias = `terrarakrya_${uuidv4()}`
  const client = await sdk.createClient({
    baseUrl: process.env.MATRIX_HOMESERVER,
    accessToken: 'syt_a3J5YWRtaW4_HmqwGKXoNWLyOvGfcJsa_0Fbrnf',
    userId: '@kryadmin:terrakrya.com',
  })
  try {
    const room = await client.createRoom({
      name,
      topic,
      visibility: 'public',
      room_alias_name: roomAlias,
    })
    return room
  } catch (e) {
    console.log(e)
    throw e
  }
}
