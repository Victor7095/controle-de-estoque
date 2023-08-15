from fastapi import APIRouter, Depends, Request
from sqlalchemy import func
from sqlmodel import Session, select
from app.dependencies.database_session import get_session
from app.models.category import Category
from app.models.product import Product
from app.models.sale import Sale

from app.schemas.sales import SaleCreate, SaleRead

router = APIRouter()


@router.get("/charts")
async def charts(session: Session = Depends(get_session)):
  last_four_sales = select(Sale).order_by(Sale.created_on.desc()).limit(4)
  last_four_sales = session.exec(last_four_sales).all()

  sales_count = func.count(Sale.id).label("sales_count")

  sales_group_by_category = select([sales_count, Category.name]).select_from(Sale).join(Product).join(Category).group_by(
      Category.name)
  sales_group_by_category = session.exec(sales_group_by_category).all()

  ten_most_sold_products = select([sales_count, Product.name]).select_from(Sale).join(
      Product).order_by(sales_count).limit(10)
  ten_most_sold_products = session.exec(ten_most_sold_products).all()

  response = {
      "last_four_sales": last_four_sales,
      "sales_group_by_category": sales_group_by_category,
      "ten_most_sold_products": ten_most_sold_products
  }

  return response


@router.post("/", response_model=SaleRead)
async def buy_product(*, session: Session = Depends(get_session), sale: SaleCreate, request: Request):
  db_sale = Sale.from_orm(sale)
  db_sale.bought_by_id = request.state.user.id
  session.add(db_sale)
  session.commit()
  session.refresh(db_sale)
  return db_sale
