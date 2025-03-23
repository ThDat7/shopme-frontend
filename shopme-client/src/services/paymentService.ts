import { VietQRBank, VietQRBankResponse } from '../types/payment'
import { BaseService } from './baseService'

class PaymentService extends BaseService {
  async getListBank(): Promise<VietQRBank[]> {
    try {
      const getBankUrl = 'https://api.vietqr.io/v2/banks'
      const res: VietQRBankResponse = await this.api.get(getBankUrl)
      return res.data
    } catch (error) {
      return this.handleError(error)
    }
  }
}

export default new PaymentService()
