import Service from '@/services/service'

class LogService extends Service {
  // what options?
  errorRecords = []
  infoRecords = []
  warningRecords = []

  error(data) {
    this.errorRecords.push({ time: Date.now(), data })
    console.error('ERROR >> ', data)
    // send directly to api or matrix here
    // showError?
  }

  info(data) {
    this.infoRecords.push({ time: Date.now(), data })
    console.log('INFO >>', data)
  }

  warning(data) {
    console.warn(data)
  }
}

const LogServiceInstance = new LogService()

export default LogServiceInstance
