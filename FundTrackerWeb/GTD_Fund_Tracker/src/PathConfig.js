const Paths = {
    register: "/register",
    adminDashboard:"/admin",
    adminMonthlyHistory: "/admin/month_history",
    adminAddSpending : "/admin/add_spending",
    adminSpendingHistory : "/admin/spending_history",
    adminMakeContribution : "/admin/make_contribution",
    adminManageRequests : "/admin/requests",
    adminManageUsers : "/admin/manage_users",
    adminAgGrid : "/admin/ag-grid",

    userDashboard : "/user",
    userViewHistory : "/user/view_history",
    userViewPending : "/user/view_pending",
    
    mailSentPage : "/mail-sent",
    mailConfirmedPage : "/confirmed/:handle",
    forgotPassword : "/forgot-password",
    setPassword : "/set-password/:handle",
    resetPassword : "/reset-password",
    passwordUpdated : "/password-updated",
    accessDenied : "/warning/accessdenied"

}

export default Paths;