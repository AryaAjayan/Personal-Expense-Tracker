from typing import List, Optional, Tuple, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_, and_
from datetime import date

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate

class ExpenseRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_expenses(
        self,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        search: Optional[str] = None
    ) -> Tuple[List[Expense], int]:
        query = self.db.query(Expense)

        if category:
            query = query.filter(Expense.category == category)
        if start_date:
            query = query.filter(Expense.date >= start_date)
        if end_date:
            query = query.filter(Expense.date <= end_date)
        if search:
            query = query.filter(Expense.title.ilike(f"%{search}%"))

        total = query.count()
        # Sort by most recent first
        expenses = query.order_by(desc(Expense.date), desc(Expense.id)).offset(skip).limit(limit).all()
        return expenses, total

    def get_expense(self, expense_id: int) -> Optional[Expense]:
        return self.db.query(Expense).filter(Expense.id == expense_id).first()

    def create_expense(self, expense: ExpenseCreate) -> Expense:
        db_expense = Expense(**expense.model_dump())
        self.db.add(db_expense)
        self.db.commit()
        self.db.refresh(db_expense)
        return db_expense

    def update_expense(self, db_expense: Expense, expense_update: ExpenseUpdate) -> Expense:
        update_data = expense_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_expense, key, value)
        self.db.commit()
        self.db.refresh(db_expense)
        return db_expense

    def delete_expense(self, db_expense: Expense) -> None:
        self.db.delete(db_expense)
        self.db.commit()

    def get_summary(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict[str, Any]:
        query = self.db.query(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        
        if start_date:
            query = query.filter(Expense.date >= start_date)
        if end_date:
            query = query.filter(Expense.date <= end_date)
            
        category_breakdown_raw = query.group_by(Expense.category).all()
        
        category_breakdown = [
            {"category": row[0], "total": row[1] or 0} 
            for row in category_breakdown_raw
        ]
        
        total_spent = sum(item["total"] for item in category_breakdown)
        
        return {
            "total_spent": total_spent,
            "category_breakdown": category_breakdown
        }

    def get_monthly_list(self) -> List[Dict[str, Any]]:
        query = self.db.query(
            func.strftime('%Y-%m', Expense.date).label('month'),
            func.sum(Expense.amount).label('total')
        ).group_by('month').order_by(desc('month')).all()
        
        return [{"month": row[0], "total": row[1] or 0} for row in query if row[0]]
