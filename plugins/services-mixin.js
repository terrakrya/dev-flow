import MatrixService from '@/services/matrix-service'
import LogsSevice from '@/services/logs-service'

import Service from '@/services/service'

export default ({ app, ...other }, inject) => {
  Service.prototype.$router = app.router
  Service.prototype.$store = app.store
  Service.prototype.$auth = app.$auth

  inject('log', LogsSevice)
  inject('matrix', MatrixService)
}
