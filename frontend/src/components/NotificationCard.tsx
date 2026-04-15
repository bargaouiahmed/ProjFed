import type { Notification } from "@/querys/useNotifications";

export default function NotificationCard({ notif }: { notif: Notification }) {
  return (
    <div
      key={notif.id}
      className={`group relative p-4 rounded-xl border bg-card ${
        !notif.seen ? "border-emerald-500/40 shadow-sm" : "border-border"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Icon/Indicator Section */}
        <div className="mt-1">
          {notif.message.includes("accepted") ? (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-warning/10">
              <div className="h-2 w-2 rounded-full bg-warning" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 space-y-1">
          <p className="text-sm leading-relaxed text-emerald-500 font-medium">
            {notif.message}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
              {new Date(notif.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </p>
            <span className="text-muted-foreground/30">•</span>
            <p className="text-[11px] text-muted-foreground uppercase tracking-tight">
              {new Date(notif.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* New Badge */}
        {!notif.seen && (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
            NEW
          </span>
        )}
      </div>
    </div>
  );
}
