import api from './api';

export const eventService = {
  getEvents: async () => {
    const { data } = await api.get('/events/');
    return data;
  },

  getEvent: async (id: number) => {
    const { data } = await api.get(`/events/${id}/`);
    return data;
  },

  createEvent: async (eventData: any) => {
    const { data } = await api.post('/events/', eventData);
    return data;
  },

  updateEvent: async (id: number, eventData: any) => {
    const { data } = await api.patch(`/events/${id}/`, eventData);
    return data;
  },

  deleteEvent: async (id: number) => {
    const { data } = await api.delete(`/events/${id}/`);
    return data;
  },

  registerForEvent: async (id: number) => {
    const { data } = await api.post(`/events/${id}/register/`);
    return data;
  },

  unregisterFromEvent: async (id: number) => {
    const { data } = await api.post(`/events/${id}/unregister/`);
    return data;
  },

  getRegistrations: async () => {
    const { data } = await api.get('/registrations/');
    return data;
  },
};
