/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TaskStatus, TaskPriority, UserRole } from "./types";

// تعيين الاتجاه للغة العربية تلقائياً عند التشغيل
if (typeof window !== "undefined") {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
}

export const ROLE_TRANSLATIONS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: "مدير النظام العام",
  [UserRole.MANAGER]: "المدير العام للمؤسسة",
  [UserRole.SUPERVISOR]: "مشرف مالي/إداري",
  [UserRole.EMPLOYEE]: "موظف ممارس",
};

export const STATUS_TRANSLATIONS: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  [TaskStatus.PENDING]: { label: "معلقة", color: "text-amber-600 border-amber-200", bg: "bg-amber-50" },
  [TaskStatus.IN_PROGRESS]: { label: "قيد التنفيذ", color: "text-blue-600 border-blue-200", bg: "bg-blue-50" },
  [TaskStatus.UNDER_REVIEW]: { label: "قيد المراجعة", color: "text-purple-600 border-purple-200", bg: "bg-purple-50" },
  [TaskStatus.COMPLETED]: { label: "مكتملة ومقبولة", color: "text-emerald-600 border-emerald-200", bg: "bg-emerald-50" },
  [TaskStatus.REJECTED]: { label: "مرفوضة / تعديل", color: "text-rose-600 border-rose-200", bg: "bg-rose-50" },
  [TaskStatus.CANCELLED]: { label: "ملغاة", color: "text-slate-500 border-slate-200", bg: "bg-slate-50" },
  [TaskStatus.OVERDUE]: { label: "متأخرة عن الاستحقاق", color: "text-red-700 border-red-200", bg: "bg-red-50" },
};

export const PRIORITY_TRANSLATIONS: Record<TaskPriority, { label: string; color: string; bg: string }> = {
  [TaskPriority.LOW]: { label: "منخفضة", color: "text-slate-600", bg: "bg-slate-100" },
  [TaskPriority.MEDIUM]: { label: "متوسطة", color: "text-indigo-600 border-indigo-100", bg: "bg-indigo-50" },
  [TaskPriority.HIGH]: { label: "عالية", color: "text-orange-600 border-orange-100", bg: "bg-orange-50" },
  [TaskPriority.URGENT]: { label: "عاجلة جداً", color: "text-red-600 border-red-100 animate-pulse", bg: "bg-red-50" },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(amount);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("ar-SA", { dateStyle: "long" }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatTime(dateTimeStr: string): string {
  if (!dateTimeStr) return "";
  try {
    const d = new Date(dateTimeStr);
    return new Intl.DateTimeFormat("ar-SA", { timeStyle: "short" }).format(d);
  } catch {
    return dateTimeStr;
  }
}

export function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const past = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays === 1) return "أمس";
    if (diffDays === 2) return "منذ يومين";
    return `منذ ${diffDays} أيام`;
  } catch {
    return dateStr;
  }
}

export function getFileIcon(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("pdf")) return "📄";
  if (t.includes("doc") || t.includes("docx")) return "📝";
  if (t.includes("xls") || t.includes("xlsx") || t.includes("csv")) return "📊";
  if (t.includes("jpg") || t.includes("jpeg") || t.includes("png") || t.includes("gif")) return "🖼️";
  if (t.includes("zip") || t.includes("rar")) return "📦";
  if (t.includes("mp4") || t.includes("mov")) return "🎥";
  return "📁";
}

// Token Storage Manager
const TOKEN_KEY = "enterprise_mgmt_token";
const USER_KEY = "enterprise_mgmt_user";

export const authStorage = {
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },
  getUser: () => {
    if (typeof window !== "undefined") {
      const u = localStorage.getItem(USER_KEY);
      return u ? JSON.parse(u) : null;
    }
    return null;
  },
  saveSession: (token: string, user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clearSession: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
};
