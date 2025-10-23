"use client";

import { Bell, AlertTriangle, Info, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/providers/NotoficationsProvider";

export function NotificationsDropdown() {
  const { notifications, markAsRead, clearNotifications, unreadCount } =
    useNotifications();

  const getIcon = (type?: string) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 max-h-96 overflow-auto shadow-lg"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={clearNotifications}
            >
              Clear all
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}

        {notifications.map((notif) => (
          <DropdownMenuItem
            key={notif.id}
            className={cn(
              "flex items-start gap-3 py-3",
              !notif.read && "bg-muted/40"
            )}
            onClick={() => markAsRead(notif.id)}
          >
            <div>{getIcon(notif.type)}</div>
            <div className="flex-1">
              <p className="font-medium text-sm">{notif.title}</p>
              <p className="text-xs text-muted-foreground">{notif.message}</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {notif.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
