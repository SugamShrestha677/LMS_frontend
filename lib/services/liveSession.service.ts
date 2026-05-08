import api from './api';

const BASE = (courseId: number) => `/courses/${courseId}/live-sessions`;
const SESSION_BASE = (courseId: number, sessionId: number) => `${BASE(courseId)}/${sessionId}`;

export const liveSessionService = {
  // ── Student & Tutor ─────────────────────────────────────────────────────────
  getSessions: (courseId: number) =>
    api.get(BASE(courseId)).then((r) => r.data),

  getSession: (courseId: number, sessionId: number) =>
    api.get(SESSION_BASE(courseId, sessionId)).then((r) => r.data),

  getJoinLink: (courseId: number, sessionId: number) =>
    api.get(`${SESSION_BASE(courseId, sessionId)}/join-link/`).then((r) => r.data),

  // ── Tutor/Admin ─────────────────────────────────────────────────────────────
  createSession: (courseId: number, data: any) =>
    api.post(BASE(courseId) + '/', data).then((r) => r.data),

  updateSession: (courseId: number, sessionId: number, data: any) =>
    api.patch(SESSION_BASE(courseId, sessionId) + '/', data).then((r) => r.data),

  deleteSession: (courseId: number, sessionId: number) =>
    api.delete(SESSION_BASE(courseId, sessionId) + '/').then((r) => r.data),

  markAttendance: (courseId: number, sessionId: number, records: any[]) =>
    api
      .post(`${SESSION_BASE(courseId, sessionId)}/attendance/`, { records })
      .then((r) => r.data),

  addSummary: (courseId: number, sessionId: number, data: any) =>
    api
      .post(`${SESSION_BASE(courseId, sessionId)}/summary/`, data)
      .then((r) => r.data),

  getAttendanceReport: (courseId: number, sessionId: number) =>
    api
      .get(`${SESSION_BASE(courseId, sessionId)}/attendance-report/`)
      .then((r) => r.data),

  getAttendanceOverview: (courseId: number) =>
    api.get(`/courses/${courseId}/attendance-overview/`).then((r) => r.data),
};
