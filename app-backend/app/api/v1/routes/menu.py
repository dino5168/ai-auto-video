from fastapi import APIRouter

from app.schemas.menu import NavGroupSchema

router = APIRouter(prefix="/menu", tags=["menu"])

_NAV_GROUPS: list[NavGroupSchema] = [
    NavGroupSchema(
        title="OVERVIEW",
        items=[
            {
                "label": "管理者面板",
                "href": "/dashboard",
                "icon": "LayoutDashboard",
                "badge": "1",
                "children": [
                    {"label": "Overview", "href": "/dashboard/overview", "icon": "PieChart"},
                    {"label": "Reports", "href": "/dashboard/reports", "icon": "TrendingUp"},
                ],
            },
            {"label": "Analytics", "href": "/analytics", "icon": "BarChart2"},
            {"label": "eCommerce", "href": "/ecommerce", "icon": "ShoppingBag"},
            {"label": "CRM", "href": "/crm", "icon": "Users2"},
            {"label": "SaaS", "href": "/saas", "icon": "Cloud"},
        ],
    ),
    NavGroupSchema(
        title="COMMERCE",
        items=[
            {
                "label": "Orders",
                "href": "/orders",
                "icon": "ShoppingCart",
                "badge": 12,
                "children": [
                    {"label": "Pending", "href": "/orders/pending", "icon": "Clock"},
                    {"label": "Completed", "href": "/orders/completed", "icon": "ClipboardCheck"},
                    {"label": "Cancelled", "href": "/orders/cancelled", "icon": "XCircle"},
                ],
            },
            {"label": "Products", "href": "/products", "icon": "Package"},
            {"label": "Customers", "href": "/customers", "icon": "Users"},
            {"label": "Invoices", "href": "/invoices", "icon": "FileText"},
        ],
    ),
    NavGroupSchema(
        title="APPS",
        items=[
            {"label": "Mail", "href": "/mail", "icon": "Mail"},
            {"label": "Chat", "href": "/chat", "icon": "MessageSquare"},
            {"label": "Files", "href": "/files", "icon": "Folder"},
            {"label": "Kanban", "href": "/kanban", "icon": "KanbanSquare"},
            {"label": "Calendar", "href": "/calendar", "icon": "Calendar"},
            {"label": "Forms", "href": "/forms", "icon": "ClipboardList"},
        ],
    ),
    NavGroupSchema(
        title="SYSTEM",
        items=[
            {"label": "Users", "href": "/users", "icon": "Users"},
            {"label": "Notifications", "href": "/notifications", "icon": "Bell", "badge": 3},
            {"label": "Settings", "href": "/settings", "icon": "Settings"},
            {"label": "Help & Support", "href": "/help", "icon": "HelpCircle"},
        ],
    ),
]


@router.get("", response_model=list[NavGroupSchema])
async def get_menu() -> list[NavGroupSchema]:
    """Return the application navigation menu structure.

    Returns:
        Ordered list of nav groups, each containing nav items.
    """
    return _NAV_GROUPS
