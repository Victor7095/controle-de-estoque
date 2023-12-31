from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.dependencies.database_session import get_session
from app.models.category import Category
from app.models.product import Product
from app.models.sale import Sale

from app.schemas.sales import Charts, SaleCreate, SaleRead

router = APIRouter()


@router.get("/charts", response_model=Charts)
async def charts(session: Session = Depends(get_session)):
  last_four_sales = select(Sale).options(
      selectinload(Sale.bought_by)).options(
      selectinload(Sale.product)).order_by(Sale.created_on.desc()).limit(4)
  last_four_sales = session.exec(last_four_sales).all()

  sales_count = func.count(Sale.id).label("sales_count")

  sales_grouped_by_category = select(
      sales_count, Category.name.label("category_name")
  ).select_from(Sale).join(Product).join(Category).group_by(Category.name)
  sales_grouped_by_category = session.exec(sales_grouped_by_category).all()

  ten_most_sold_products = select(
      sales_count, Product.name.label("product_name")
  ).select_from(Sale).join(Product).group_by(Product.name).order_by(sales_count.desc()).limit(10)
  ten_most_sold_products = session.exec(ten_most_sold_products).all()

  response = {
      "last_four_sales": last_four_sales,
      "sales_grouped_by_category": sales_grouped_by_category,
      "ten_most_sold_products": ten_most_sold_products
  }

  return response


@router.post("/buy-product", response_model=SaleRead)
async def buy_product(*, session: Session = Depends(get_session), sale: SaleCreate, request: Request):
  if sale.quantity <= 0:
    raise HTTPException(
        status_code=400, detail="Quantity must be greater than 0")

  product = session.get(Product, db_sale.product_id)

  if product.stock_quantity < db_sale.quantity:
    raise HTTPException(status_code=400, detail="Not enough stock")

  product.stock_quantity -= db_sale.quantity

  db_sale = Sale.from_orm(sale)
  db_sale.bought_by_id = request.state.user.id

  session.add(db_sale)
  session.commit()
  session.refresh(db_sale)
  return db_sale
