from pydantic import BaseModel, ConfigDict, Field
from datetime import date as DateType, datetime
from typing import Optional, List
from decimal import Decimal

class ExpenseBase(BaseModel):
    title: str = Field(..., max_length=100, pattern=r'^[a-zA-Z\s]*$')
    amount: Decimal = Field(..., gt=0)
    category: str = Field(..., max_length=50)
    date: DateType
    note: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    """Standalone schema to avoid Pydantic v2 inheritance issues.
    Uses DateType alias to prevent field name 'date' from shadowing
    the datetime.date type in Pydantic's annotation resolution.
    """
    title: Optional[str] = Field(None, max_length=100, pattern=r'^[a-zA-Z\s]*$')
    amount: Optional[Decimal] = Field(None, gt=0)
    category: Optional[str] = Field(None, max_length=50)
    date: Optional[DateType] = None
    note: Optional[str] = None

class ExpenseInDBBase(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Expense(ExpenseInDBBase):
    pass

class PaginatedExpenseResponse(BaseModel):
    items: List[Expense]
    total: int
    page: int
    size: int

class CategorySummary(BaseModel):
    category: str
    total: Decimal

class MonthlySummaryResponse(BaseModel):
    total_spent: Decimal
    category_breakdown: List[CategorySummary]

class MonthlyListEntry(BaseModel):
    month: str
    total: Decimal
