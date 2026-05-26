from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date

from app.core.database import get_db
from app.schemas.expense import (
    Expense,
    ExpenseCreate,
    ExpenseUpdate,
    PaginatedExpenseResponse,
    MonthlySummaryResponse,
    MonthlyListEntry
)
from app.services.expense_service import ExpenseService

router = APIRouter()

def get_expense_service(db: Session = Depends(get_db)) -> ExpenseService:
    return ExpenseService(db)

@router.get("/summary", response_model=MonthlySummaryResponse)
def get_expense_summary(
    start_date: Optional[date] = Query(None, description="Start date for summary filter"),
    end_date: Optional[date] = Query(None, description="End date for summary filter"),
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Get summary of expenses including total spent and category breakdown.
    """
    return service.get_summary(start_date=start_date, end_date=end_date)

@router.get("", response_model=PaginatedExpenseResponse)
def get_expenses(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    category: Optional[str] = Query(None, description="Filter by category"),
    start_date: Optional[date] = Query(None, description="Filter by start date"),
    end_date: Optional[date] = Query(None, description="Filter by end date"),
    search: Optional[str] = Query(None, description="Search by title"),
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Get a paginated list of expenses with optional filtering.
    """
    items, total = service.get_expenses(
        page=page,
        size=size,
        category=category,
        start_date=start_date,
        end_date=end_date,
        search=search
    )
    return {
        "items": items,
        "total": total,
        "page": page,
        "size": size
    }

@router.post("", response_model=Expense, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Create a new expense.
    """
    return service.create_expense(expense)

@router.get("/summary/monthly", response_model=List[MonthlyListEntry])
def get_monthly_summary_list(
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Get a list of all months that have expenses, along with the total spent.
    """
    return service.get_monthly_list()

@router.get("/{expense_id}", response_model=Expense)
def get_expense(
    expense_id: int,
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Get an expense by ID.
    """
    return service.get_expense(expense_id)

@router.put("/{expense_id}", response_model=Expense)
def update_expense(
    expense_id: int,
    expense_update: ExpenseUpdate,
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Update an expense.
    """
    return service.update_expense(expense_id, expense_update)

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    service: ExpenseService = Depends(get_expense_service)
):
    """
    Delete an expense.
    """
    service.delete_expense(expense_id)
