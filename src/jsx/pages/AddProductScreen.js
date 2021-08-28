import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import './Style2.css';

import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { useFormikContext } from 'formik';

// Then inside the component body

import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import TextField from '../components/TextField';
import Select from '../components/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../../actions/categoryActions';
import { listShops } from '../../actions/shopActions';
import VariationOptions from './VariationOptions';
import ChooseVariationOptions from './ChooseVariationOptions';
import VariationTable from './VariationTable';
import {
  createProduct,
  deleteProduct,
  listProductDetails,
  listProducts,
} from '../../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { productDetailsReducer } from '../../reducers/productReducers';
import { deleteVariationImage } from '../../actions/variationActions';

const AddProductScreen = ({ history, match, hasVariant, setHasVariant }) => {
  //const [hasVariant, setHasVariant] = useState({ checked: false });
  const [ProductVariationList, setProductVariationList] = useState([]);
  const [hasColor, setHasColor] = useState({ checked: false });
  const [hasSize, setHasSize] = useState({ checked: false });

  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });
  const [offer, setOffer] = useState({ checked: false });

  const [productImageURL, setProductImageURL] = useState();
  const [productImageFile, setProductImageFile] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(false);
  const [varId, setVarId] = useState(0);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formikFileArray, setFormikFileArray] = useState([]);

  const [pushh, setPush] = useState(false);

  const submitform = useRef(null);

  const productId = match.params.id;

  const validateWithoutVariation = Yup.object({
    name_ar: Yup.string(),
    name_en: Yup.string().required('Required'),
    shop_id: Yup.number().required('Required'),
    description_ar: Yup.string(),
    description_en: Yup.string().required('Required'),
    category_id: Yup.number().required('Required'),
  });

  const validateWithVariation = Yup.object({
    name_ar: Yup.string(),
    name_en: Yup.string().required('Required'),

    shop_id: Yup.number().required('Required'),
    description_ar: Yup.string(),
    description_en: Yup.string().required('Required'),
    category_id: Yup.number().required('Required'),
    price: Yup.number().required('Required'),
    offerprice: Yup.number().required('Required'),
    stocks: Yup.number().required('Required'),
  });

  const validateWithoutofferPrice = Yup.object({
    name_ar: Yup.string(),
    name_en: Yup.string().required('Required'),

    shop_id: Yup.number().required('Required'),
    description_ar: Yup.string(),
    description_en: Yup.string().required('Required'),
    category_id: Yup.number().required('Required'),
    price: Yup.number().required('Required'),
    offerprice: Yup.number(),
    stocks: Yup.number().required('Required'),
  });

  const handleVariationImageChange = (e, formik) => {
    if (productId) {
      if (formik.isValid) {
        if (e.target.files) {
          const filesArray = Array.from(e.target.files).map((file) =>
            URL.createObjectURL(file)
          );

          setSelectedFiles((prevImages) => prevImages.concat(filesArray));

          Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
        }

        const files = Array.from(e.target.files).map((file) => file);

        Array.from(e.target.files).forEach((file) => {
          formikFileArray.push(file);
        });

        formik.setFieldValue('image', formikFileArray);

      

        handleformdata(formik, 3);
      } else {
      
      }
    } else {
      if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        );

        setSelectedFiles((prevImages) => prevImages.concat(filesArray));

        Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
      }

      const files = Array.from(e.target.files).map((file) => file);

      Array.from(e.target.files).forEach((file) => {
        formikFileArray.push(file);
      });

      formik.setFieldValue('image', formikFileArray);
    }
  };

  const renderPhotos = (source, formik) => {
    return source.map((photo, index) => {
      return photo !== 'https://khaymatapi.mvp-apps.ae/storage/' ? (
        <div className="">
          <Card
            className="my-2 p-1 rounded"
            style={{ height: '180px', objectFit: 'contain' }}
          >
            <Card.Img
              style={{ height: '170px', objectFit: 'contain' }}
              src={photo}
              variant="top"
              key={photo}
            />
            <button
              onClick={(e) =>
                handleRemoveVariationImage(
                  e,
                  source[index],
                  index,
                  source,
                  formikFileArray,
                  formik
                )
              }
              type="button px-1"
              className="btn btn-white text-danger rounded fs-3"
              style={{ position: 'absolute' }}
            >
              <i className="bx bx-trash"></i>
            </button>
          </Card>
        </div>
      ) : (
        ''
      );
    });
  };

  const handleRemoveVariationImage = (
    e,
    fileToRemove,
    index,
    source,
    formikFileArray,
    formik
  ) => {
    e.preventDefault();
    if (formik.values.image.length === 1) {
      alert('atleast one image required');
      return;
    }
    source = source.filter((fileName) => fileName !== fileToRemove);
    formikFileArray.filter((fileName) => fileName !== fileToRemove);

    if (varId) {
      var url = `khaymatapi.mvp-apps.ae/storage/`;
      var result = fileToRemove.toString();
      result = result.replace(url.toString(), '');
      result = result.replace('://www.', '');
      result = result.replace('https://', '');
      dispatch(deleteVariationImage(result, varId));
    }

    setSelectedFiles(source);
    const files = Array.from(formikFileArray).filter((file, i) => index !== i);
    formik.setFieldValue('images', files);
    formik.setFieldValue('image', source);
    setFormikFileArray(files);
  };

  const renderImageUpload = (formik) => {
    return (
      <div>
        <div className="row g-3">
          <div className="col-12">
            <label
              style={{ cursor: 'pointer' }}
              className="text-nowrap border shadow py-3 px-4 bg-white text-success add-photo rounded w-100"
              htmlFor="file"
            >
              <i className="bx bx-cloud-upload mx-2"></i>Upload New Image
            </label>
          </div>
          <div className="col">
            <input
              name="image"
              type="file"
              id="file"
              multiple
              onChange={(e) => handleVariationImageChange(e, formik)}
            />
            <div className="result rounded">
              {renderPhotos(selectedFiles, formik)}
            </div>
          </div>
        </div>
        <ErrorMessage
          component="div"
          className="error text-danger"
          name={'image'}
        />
      </div>
    );
  };

  const renderPriceStock = (formik) => {
    return !hasVariant.checked ? (
      <>
        <Row>
          <Col className="col-md-6">
            <TextField label="Price" name="price" type="number" />
          </Col>
          <Col className="col-md-6">
            <TextField label="Stock" name="stocks" type="number" />
          </Col>
        </Row>
        {offer.checked ? (
          <Row>
            <Col className="col-md-12">
              <TextField label="Offer Price" name="offerprice" type="number" />
            </Col>
          </Row>
        ) : (
          ''
        )}

        <Row>
          <Col className="col-md-6 my-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={offer.checked}
                onChange={(d) => {
                  offer.checked === true ? (d = false) : (d = true);
                  setOffer({ checked: d });
                  formik.setFieldValue('hasoffer', d);
                }}
              />

              <label className="form-check-label">Has Offer</label>
            </div>
          </Col>
        </Row>
      </>
    ) : (
      ''
    );
  };

  const renderVariantOptions = () => {
    return (
      <Modal
        show={showOptions}
        onHide={() => {
          setShowOptions(false);
        }}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose Variation Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChooseVariationOptions
            setShowOptions={setShowOptions}
            setShow={setShow}
            hasColor={hasColor}
            setHasColor={setHasColor}
            hasSize={hasSize}
            setHasSize={setHasSize}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const productDetails = useSelector((state) => state.productDetails);
  const {
    product,
    loadingproductDetails,
    errorproductDetails,
    successproductDetails,
  } = productDetails;

  const renderChooseVariantOptionsModal = () => {
    return (
      <Modal
        show={show}
        onHide={() => {
          dispatch(listProductDetails(productId));
          setShow(false);
        }}
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Variation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VariationOptions
            setShow={setShow}
            show={show}
            hasColor={hasColor}
            setHasColor={setHasColor}
            hasSize={hasSize}
            setHasSize={setHasSize}
            setProductVariationList={setProductVariationList}
            productId={productId}
            variations={product.length > 0 ? product[0].variations : []}
            varId={varId}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const deleteProductHandler = async (e, id) => {
    e.preventDefault();
    await dispatch(deleteProduct(id));
    await dispatch(listProducts(1));

    history.push('/ecom-product-grid/page/1');
  };

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, categoryError, category } = categoryList;

  const shopList = useSelector((state) => state.shopList);
  const { shoploading, shopError, shops } = shopList;

  const populateCategory = () => {
    let objects = [category.length];
    for (var x = 0; x < category.length; x++) {
      objects[x] = { key: category[x].name, value: category[x].id };
    }
    objects.unshift({ key: 'choose', value: '' });
    return objects;
  };

  const populateShops = () => {
    let objects = [shops.length];
    for (var x = 0; x < shops.length; x++) {
      objects[x] = { key: shops[x].shop_name, value: shops[x].id };
    }
    objects.unshift({ key: 'choose', value: '' });
    return objects;
  };

  useEffect(() => {

    if (category.length === 0) {
      dispatch(getCategory());
    }

    if (shops.length === 0) {
      dispatch(listShops());
    }

    if (product && product.length > 0) {
      if (
        product[0].variations.length > 0 &&
        product[0].variations[0].hasoffer === true
      ) {
        setOffer({ checked: true });
      } else {
        setOffer({ checked: false });
      }

      if (product[0].isactive === true) {
        setActive({ checked: true });
      } else {
        setActive({ checked: false });
      }

      if (product[0].special === true) {
        setSpecial({ checked: true });
      } else {
        setSpecial({ checked: false });
      }

      if (product[0].bestSeller === true) {
        setBestSeller({ checked: true });
      } else {
        setBestSeller({ checked: false });
      }
      if (
        product[0].variations.length > 0 &&
        product[0].variations.length === 1 &&
        product[0].variations[0].color_name === null &&
        product[0].variations[0].size_value === null
      ) {
        setVarId(product[0].variations[0].id);
        setSelectedFiles(product[0].variations[0].images);
      } else {
        if (
          product[0].variations.length > 0 &&
          product[0].variations[0].color_name !== null
        ) {
          setHasColor({ checked: true });
        }
        if (
          product[0].variations.length > 0 &&
          product[0].variations[0].size_value !== null
        ) {
          setHasSize({ checked: true });
        }
      }

      setProductVariationList(product[0].variations);
    }
  }, [dispatch, productId, product]);

  useLayoutEffect(() => {

    if (product.length === 0) {
      dispatch(listProductDetails(productId));
    }
  }, [dispatch, productId]);

  const setArr = (arr, values) => {
    if (hasVariant.checked === false) {
      arr[0] = {
        price: values.price,
        stocks: values.stocks,
        images: formikFileArray,
        color_name: '',
        color_value: '',
        size_value: '',
        hasoffer: values.hasoffer,
        offerprice: values.offerprice,
      };
    }
  };
  const setFormData = (formdata, values) => {
    let arabicName = values.name_ar;
    let arbicDescription = values.description_ar;

    if (values.name_ar === '') {
      arabicName = values.name_en;
    }
    if (values.description_ar === '') {
      arbicDescription = values.description_en;
    }

    if (productId) {
      formdata.append('id', productId);
    }

    formdata.append('name_ar', arabicName);
    formdata.append('name_en', values.name_en);
    formdata.append('description_ar', arbicDescription);
    formdata.append('description_en', values.description_en);

    if (hasVariant.checked) {
      if (ProductVariationList.length > 0) {
        if (typeof ProductVariationList[0].images[0] === 'string') {
          formdata.delete('image');
        } else {
          formdata.append('image', ProductVariationList[0].images[0]);
        }
      }
    } else {
      if (typeof values.image === 'string') {
        formdata.delete('image');
      } else {
        formdata.append('image', values.image[0]);
      }
    }

    formdata.append('category_id', values.category_id);

    formdata.append('shop_id', values.shop_id);

    values.special === true
      ? formdata.append('special', 1)
      : formdata.append('special', 0);
    values.isactive === true
      ? formdata.append('isactive', 1)
      : formdata.append('isactive', 0);
    values.bestseller === true
      ? formdata.append('bestseller', 1)
      : formdata.append('bestseller', 0);
  };

  const handleformdata = (formik, resetForm) => {
    if (formik.isValid) {
      let arr = new Array(1);
      let formdata = new FormData();

      setArr(arr, formik.values);
      setFormData(formdata, formik.values);
      if (hasVariant.checked === true) {
        handleSubmit(
          formdata,
          ProductVariationList,
          resetForm,
          formik.values,
          formik
        );
      } else {
 
        handleSubmit(formdata, arr, resetForm, formik.values, formik);
      }
      formik.submitForm();
    } else {
    }
  };

  const handleSubmit = async (formdata, arr, resetForm, values) => {
    const s = ProductVariationList;
    if (hasVariant.checked && s.length === 0) {
      alert('Add atleast one variation, Image Required');
    } else {
      await dispatch(
        createProduct(
          dispatch,
          formdata,
          arr,
          hasVariant,
          productId,
          varId,
          values
        )
      );

      await dispatch(listProducts(1));

      setProductVariationList([]);

      setProductImageURL(null);

      history.push('/ecom-product-grid/page/1');
    }
  };

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate;

  const variationCreate = useSelector((state) => state.variationCreate);
  const {
    loading: loadingCreateVariation,
    error: errorCreateVariation,
    success: successCreateVariation,
  } = variationCreate;

  const singleVariationCreate = useSelector(
    (state) => state.singleVariationCreate
  );
  const {
    loading: loadingSingleCreateVariation,
    error: errorSingleCreateVariation,
    success: successSingleCreateVariation,
  } = singleVariationCreate;

  const validate = () => {
    if (hasVariant.checked) {
      return validateWithoutVariation;
    } else {
      if (offer.checked) {
        return validateWithVariation;
      } else {
        return validateWithoutofferPrice;
      }
    }
  };

  return (
    <>
      {loadingproductDetails || loadingSingleCreateVariation ? (
        <Loader />
      ) : errorproductDetails || errorSingleCreateVariation ? (
        <Message variant="danger">
          {errorproductDetails || errorSingleCreateVariation}
        </Message>
      ) : (
        <div>
          <span>
            {}
            {loadingCreate && <Loader />}
            {loadingCreateVariation && <Loader />}
          </span>

          {errorCreate && <Message variant="danger">{errorCreate}</Message>}

          {errorCreateVariation && (
            <Message variant="danger">{errorCreateVariation}</Message>
          )}

          {errorproductDetails && (
            <Message variant="danger">{errorproductDetails}</Message>
          )}

          <Formik
            enableReinitialize
            initialValues={{
              name_ar: product.length === 0 ? '' : product[0].name_ar,
              name_en: product.length === 0 ? '' : product[0].name_en,
              image:
                product.length === 0 || product[0].variations.length === 0
                  ? ''
                  : product[0].variations[0].images,
              shop_id: product.length === 0 ? '' : product[0].shop_id,
              description_ar:
                product.length === 0 ? '' : product[0].description_ar,
              description_en:
                product.length === 0 ? '' : product[0].description_en,
              category_id: product.length === 0 ? '' : product[0].category_id,

              bestseller: product.length === 0 ? false : product[0].bestSeller,
              special: product.length === 0 ? false : product[0].special,
              isactive: product.length === 0 ? false : product[0].isactive,
              hasoffer:
                product.length === 0 || product[0].variations.length === 0
                  ? false
                  : product[0].variations[0].hasoffer,
              price:
                product.length === 0 || product[0].variations.length === 0
                  ? ''
                  : product[0].variations[0].price,
              offerprice:
                product.length === 0 || product[0].variations.length === 0
                  ? ''
                  : product[0].variations[0].offerprice,
              stocks:
                product.length === 0 || product[0].variations.length === 0
                  ? ''
                  : product[0].variations[0].stocks,
            }}
            innerRef={submitform}
            validationSchema={validate()}
            validateOnMount={true}
            onSubmit={() => {}}
          >
            {(formik) => (
              <Form>
             
                <Row className="my-5">
                  {hasVariant.checked ? (
                    ''
                  ) : (
                    <Col className="w-auto">{renderImageUpload(formik)}</Col>
                  )}
                </Row>

                <Row>
                  <Col className="col-md-6">
                    <TextField label="Arabic Name" name="name_ar" type="text" />
                  </Col>
                  <Col className="col-md-6">
                    <TextField
                      label="English Name"
                      name="name_en"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row>
          
                  <Col className="col-md-6">
                    <TextField
                      label="Arabic Description"
                      name="description_ar"
                      type="text"
                    />
                  </Col>
                  <Col className="col-md-6">
                    <TextField
                      label="English Description"
                      name="description_en"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="col-md-6">
                    <Select
                      control="select"
                      label="Category"
                      name="category_id"
                      options={populateCategory()}
                    ></Select>
                  </Col>
                  <Col className="col-md-6">
                    <Select
                      control="select"
                      label="Shop Name"
                      name="shop_id"
                      options={populateShops()}
                    ></Select>
                  </Col>
                </Row>

                {renderPriceStock(formik)}

                <Row>
                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="Active"
                        checked={active.checked}
                        onChange={(d) => {
                          active.checked === true ? (d = false) : (d = true);
                          setActive({ checked: d });
                          formik.setFieldValue('isactive', d);
                        }}
                      />

                      <label className="form-check-label" htmlFor="Active">
                        Active Status
                      </label>
                    </div>
                  </Col>

                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={special.checked}
                        onChange={(d) => {
                          special.checked === true ? (d = false) : (d = true);
                          setSpecial({ checked: d });
                          formik.setFieldValue('special', d);
                        }}
                      />
                      <label className="form-check-label">Special</label>
                    </div>
                  </Col>

                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={bestSeller.checked}
                        onChange={(d) => {
                          bestSeller.checked === true
                            ? (d = false)
                            : (d = true);
                          setBestSeller({ checked: d });
                          formik.setFieldValue('bestseller', d);
                        }}
                      />
                      <label className="form-check-label">Best Seller</label>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end my-5">
                  {productId ? (
                    <div>
                      <button
                        className="text-nowrap btn btn-outline-danger mx-2 rounded p-3 my-2"
                        onClick={(e) => deleteProductHandler(e, productId)}
                      >
                        Delete Product
                      </button>
                    </div>
                  ) : (
                    ''
                  )}

                  {hasVariant.checked ? (
                    <div>
                      <button
                        className="text-nowrap btn btn-outline-success mx-2 rounded p-3 my-2"
                        onClick={(e) => {
                          e.preventDefault();

                          if (ProductVariationList.length === 0) {
                            setShowOptions(true);
                          } else {
                            setShowOptions(false);
                            setShow(true);
                            setVarId(0);
                          }
                        }}
                      >
                        Add New Variation
                      </button>
                    </div>
                  ) : (
                    ''
                  )}
                  <div>
                    <button
                      className="text-nowrap btn btn-outline-success mx-2 rounded p-3 my-2"
                      onClick={(e) => {
                        if (formik.isValid) {
                          handleformdata(formik, 3);
                        }
                      }}
                    >
                      {productId ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </div>

                {showOptions ? renderVariantOptions() : ''}
                {show ? renderChooseVariantOptionsModal() : ''}
              </Form>
            )}
          </Formik>

          {ProductVariationList.length > 0 ? (
            <VariationTable
              setProductVariationList={setProductVariationList}
              hasVariant={hasVariant}
              ProductVariationList={ProductVariationList}
              hasColor={hasColor}
              hasSize={hasSize}
              productId={productId}
              setShowOptions={setShow}
              varId={varId}
              setVarId={setVarId}
              product={product}
            />
          ) : (
            ''
          )}
        </div>
      )}
    </>
  );
};

export default AddProductScreen;
