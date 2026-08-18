import Service from '@/services/service'

// Quanto de histórico cada lista guarda. Os registros só existem para inspeção
// pontual: sem limite eles crescem para sempre e seguram vivo tudo que já foi
// logado (inclusive o objeto de auth inteiro).
const MAX_RECORDS = 100

class LogService extends Service {
  errorRecords = []
  infoRecords = []
  warningRecords = []

  push(records, data) {
    records.push({ time: Date.now(), data })
    if (records.length > MAX_RECORDS) {
      records.splice(0, records.length - MAX_RECORDS)
    }
  }

  error(data) {
    this.push(this.errorRecords, data)
    console.error('ERROR >> ', data)
    // send directly to api or matrix here
    // showError?
  }

  info(data) {
    this.push(this.infoRecords, data)
    console.log('INFO >>', data)
  }

  warning(data) {
    console.warn(data)
  }
}

const LogServiceInstance = new LogService()

export default LogServiceInstance
