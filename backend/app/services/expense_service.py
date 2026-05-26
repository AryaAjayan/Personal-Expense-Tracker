from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from datetime import date
from fastapi import HTTPException, status

from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.repositories.expense_repository import ExpenseRepository
from app.models.expense import Expense

class ExpenseService:
    def __init__(self, db: Session):
        self.repo = ExpenseRepository(db)

    def get_expenses(
        self,
        page: int = 1,
        size: int = 20,
        category: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Expense], int]:
        if page < 1:
            page = 1
        skip = (page - 1) * size
        return self.repo.get_expenses(
            skip=skip,
            limit=size,
            category=category,
            start_date=start_date,
            end_date=end_date,
            search=search
        )

    def get_expense(self, expense_id: int) -> Expense:
        expense = self.repo.get_expense(expense_id)
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        return expense

    def create_expense(self, expense: ExpenseCreate) -> Expense:
        return self.repo.create_expense(expense)

    def update_expense(self, expense_id: int, expense_update: ExpenseUpdate) -> Expense:
        db_expense = self.get_expense(expense_id)
        return self.repo.update_expense(db_expense, expense_update)

    def delete_expense(self, expense_id: int) -> None:
        db_expense = self.get_expense(expense_id)
        self.repo.delete_expense(db_expense)

    def get_summary(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict[str, Any]:
        return self.repo.get_summary(start_date=start_date, end_date=end_date)

    def get_monthly_list(self) -> List[Dict[str, Any]]:
        return self.repo.get_monthly_list()
