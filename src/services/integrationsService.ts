import { externalIntegrationsHttpClient } from '@/lib/http'

export interface GoogleCalendarStatus {
  connected: boolean
  email?: string
}

export const integrationsService = {
  async getGoogleCalendarStatus(): Promise<GoogleCalendarStatus> {
    const token = (await cookieStore.get('Authentication'))?.value
    if (!token) {
      return { connected: false }
    }
    const res = await externalIntegrationsHttpClient.get<GoogleCalendarStatus>('/integrations/google-calendar/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  },

  async getGoogleCalendarConnectUrl(): Promise<{ url: string }> {
    const token = (await cookieStore.get('Authentication'))?.value
    if (!token) {
      throw new Error('User is not authenticated')
    }
    const res = await externalIntegrationsHttpClient.get<{ url: string }>('/integrations/google-calendar/connect', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return res.data
  },

  async disconnectGoogleCalendar(): Promise<void> {
    await externalIntegrationsHttpClient.delete('/integrations/google-calendar')
  },
}
