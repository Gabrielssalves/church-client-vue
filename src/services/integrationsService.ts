import { externalIntegrationsHttpClient } from '@/lib/http'

export interface GoogleCalendarStatus {
  connected: boolean
  email?: string
}

export const integrationsService = {
  async getGoogleCalendarStatus(): Promise<GoogleCalendarStatus> {
    const res = await externalIntegrationsHttpClient.get<GoogleCalendarStatus>(
      '/integrations/google-calendar/status',
    )
    return res.data
  },

  async getGoogleCalendarConnectUrl(): Promise<{ url: string }> {
    const res = await externalIntegrationsHttpClient.get<{ url: string }>(
      '/integrations/google-calendar/connect',
    )
    return res.data
  },

  async disconnectGoogleCalendar(): Promise<void> {
    await externalIntegrationsHttpClient.delete('/integrations/google-calendar/disconnect')
  },
}
