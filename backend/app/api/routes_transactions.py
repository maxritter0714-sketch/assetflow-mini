from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.config import get_db
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.transaction_service import (
    create_transaction,
    delete_transaction,
    list_transactions,
)

router = APIRouter()


@router.post("/transactions", response_model=TransactionResponse, response_model_by_alias=True, status_code=201)
def create_transaction_route(data: TransactionCreate, db: Session = Depends(get_db)):
    try:
        return create_transaction(db, data)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get("/transactions", response_model=list[TransactionResponse], response_model_by_alias=True)
def list_transactions_route(
    portfolio_id: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return list_transactions(db, portfolio_id)


@router.delete("/transactions/{transaction_id}", status_code=204)
def delete_transaction_route(transaction_id: str, db: Session = Depends(get_db)):
    if not delete_transaction(db, transaction_id):
        raise HTTPException(status_code=404, detail=f"Transaction {transaction_id!r} not found")
