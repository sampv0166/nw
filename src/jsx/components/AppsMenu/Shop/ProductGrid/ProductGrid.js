import React, { Fragment, useEffect } from 'react';
import Products from './Products';

/// Data
import productData from '../productData';

import PageTitle from '../../../../layouts/PageTitle';

import { Button, Dropdown, Nav, Pagination } from 'react-bootstrap';
import Paginate from '../../../Paginate';
import { useDispatch, useSelector } from 'react-redux';
import {
  listProductDetails,
  listProducts,
} from '../../../../../actions/productActions';
import { Link } from 'react-router-dom';
import Loader from '../../../Loader';
import Message from '../../../Message';
import { Formik } from 'formik';
import { set } from 'date-fns';

const ProductGrid = ({ match, history, hasVariant, setHasVariant }) => {
  let pageNumber = match.params.pageNumber || 1;

  let items = [];
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const paginationClicked = async (e, number) => {
    e.preventDefault();
    pageNumber = number;
    dispatch(listProducts(pageNumber));
    history.push(`/ecom-product-grid/page/${number}`);
  };

  useEffect(() => {
    dispatch(listProducts(pageNumber));

    dispatch(listProductDetails(0));

    
  }, [dispatch, pageNumber]);

  for (let number = 1; number <= pages; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === page}
        onClick={(event) => paginationClicked(event, number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const pag = (size, gutter, variant, bg, circle) => (
    <Pagination
      size={size}
      className={`mt-4  ${gutter ? 'pagination-gutter' : ''} ${
        variant && `pagination-${variant}`
      } ${!bg && 'no-bg'} ${circle && 'pagination-circle'}`}
    >
      {items}
    </Pagination>
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Fragment>
          <div className="d-flex justify-content-end">
            <div className="basic-dropdown">
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  Add Product
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => {
                      setHasVariant({ checked: false });
                      history.push('/ecom/addnewproduct');
                    }}
                  >
                    Add New Product
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={() => {
                      setHasVariant({ checked: true });
                      history.push('/ecom/addnewproduct');
                    }}
                  >
                    Add Product With Variants
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          <div className="row">
            {products.map((product) => (
              <Products
                key={product.key}
                product={product}
                setHasVariant={setHasVariant}
                history =  {history}
              />
            ))}
          </div>
          <Nav>{pag('', true, 'danger', true, false)}</Nav>
        </Fragment>
      )}
    </>
  );
};

export default ProductGrid;
