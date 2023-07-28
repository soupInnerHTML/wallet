import {IPosition, PayloadType} from "@web3uikit/core/dist/lib/Notification/types";


type INotificationPayload = Partial<Omit<PayloadType, 'type'>>

class Notification {
  private _notification = (payload: PayloadType) => {};
  defaultPosition: IPosition = 'topR'
  success(payload: INotificationPayload) {
    this._notification({
      ...payload,
      type: 'success',
      title: payload.title || 'Success',
      position: payload.position || this.defaultPosition
    })
  }
  warning(payload: INotificationPayload) {
    this._notification({
      ...payload,
      type: 'warning',
      title: payload.title || 'Warning',
      position: payload.position || this.defaultPosition
    })
  }
  error(payload: INotificationPayload) {
    this._notification({
      ...payload,
      type: 'error',
      title: payload.title || 'Error',
      position: payload.position || this.defaultPosition
    })
  }
  info(payload: INotificationPayload) {
    this._notification({
      ...payload,
      type: 'error',
      title: payload.title || 'For your information',
      position: payload.position || this.defaultPosition
    })
  }

  setNotificationFn(fn: (payload: PayloadType) => void) {
    this._notification = fn;
  }
}


export const notification = new Notification()
