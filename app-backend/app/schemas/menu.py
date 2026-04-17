from __future__ import annotations

from pydantic import BaseModel


class NavItemSchema(BaseModel):
    """A single navigation item.

    Attributes:
        label: Display text.
        href: Route path.
        icon: Lucide icon name (resolved to a component on the client).
        badge: Optional numeric badge count.
        children: Optional nested nav items.
    """

    label: str
    href: str
    icon: str
    badge: int | None = None
    children: list[NavItemSchema] | None = None


class NavGroupSchema(BaseModel):
    """A group of navigation items with a section title.

    Attributes:
        title: Section heading displayed in the sidebar.
        items: Ordered list of nav items in this group.
    """

    title: str
    items: list[NavItemSchema]
