import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("routes/auth/auth-layout.tsx", [
        index("routes/root/home.tsx"),
        route("sign-in","routes/auth/sigin-in.tsx"),
        route("sign-up","routes/auth/sign-up.tsx"),
        route("verify-email","routes/auth/verifey-email.tsx"),
        route("forgot-password","routes/auth/forget-password.tsx"),
        route("reset-password", "routes/auth/reset-password.tsx"),
    ]),

    layout("routes/dashboard/dashboard-layout.tsx", [
        route("dashboard","routes/dashboard/index.tsx"), 
        route("workspaces", "routes/dashboard/workspaces/index.tsx"),
        route("workspaces/:workspaceId", "routes/dashboard/workspaces/workspace-details.tsx"),
        
    ]),
] satisfies RouteConfig;
