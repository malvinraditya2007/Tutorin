import * as React from "react";
import { cn } from "@/lib/utils";
export function AccountHeader({ title, subtitle, userName: _userName, userRole: _userRole, avatarUrl: _avatarUrl, onNotificationsClick: _onNotificationsClick, onAccountClick: _onAccountClick, className, ...props }) {
    void _userName;
    void _userRole;
    void _avatarUrl;
    void _onNotificationsClick;
    void _onAccountClick;
    return (<header className={cn("mx-auto flex w-full max-w-[1280px] shrink-0 items-center justify-between px-8 pt-8 pb-1", className)} {...props}>
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-neutral-900">
          {title}
        </h1>
        {subtitle && (<p className="text-sm font-medium text-neutral-500">{subtitle}</p>)}
      </div>
    </header>);
}
